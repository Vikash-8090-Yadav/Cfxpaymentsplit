const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ConfluxPaymentSplitter", function () {
  let splitter;
  let owner;
  let payee1;
  let payee2;
  let payee3;
  let other;

  beforeEach(async function () {
    [owner, payee1, payee2, payee3, other] = await ethers.getSigners();

    const ConfluxPaymentSplitter = await ethers.getContractFactory("ConfluxPaymentSplitter");
    splitter = await ConfluxPaymentSplitter.deploy();
    await splitter.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await splitter.owner()).to.equal(owner.address);
    });

    it("Should start with zero total shares", async function () {
      expect(await splitter.totalShares()).to.equal(0);
    });

    it("Should start with zero total released", async function () {
      expect(await splitter.totalReleased()).to.equal(0);
    });
  });

  describe("Adding Payees", function () {
    it("Should allow owner to add payees", async function () {
      await expect(splitter.connect(owner).addPayee(payee1.address, 100))
        .to.emit(splitter, "PayeeAdded")
        .withArgs(payee1.address, 100);

      expect(await splitter.shares(payee1.address)).to.equal(100);
      expect(await splitter.totalShares()).to.equal(100);
    });

    it("Should not allow non-owner to add payees", async function () {
      await expect(
        splitter.connect(other).addPayee(payee1.address, 100)
      ).to.be.revertedWith("Not owner");
    });

    it("Should not allow adding zero address", async function () {
      await expect(
        splitter.connect(owner).addPayee(ethers.ZeroAddress, 100)
      ).to.be.revertedWith("zero address");
    });

    it("Should not allow adding with zero shares", async function () {
      await expect(
        splitter.connect(owner).addPayee(payee1.address, 0)
      ).to.be.revertedWith("shares = 0");
    });

    it("Should not allow adding same payee twice", async function () {
      await splitter.connect(owner).addPayee(payee1.address, 100);
      await expect(
        splitter.connect(owner).addPayee(payee1.address, 50)
      ).to.be.revertedWith("already added");
    });

    it("Should allow adding multiple payees", async function () {
      await splitter.connect(owner).addPayee(payee1.address, 100);
      await splitter.connect(owner).addPayee(payee2.address, 200);
      await splitter.connect(owner).addPayee(payee3.address, 300);

      expect(await splitter.totalShares()).to.equal(600);
      expect(await splitter.shares(payee1.address)).to.equal(100);
      expect(await splitter.shares(payee2.address)).to.equal(200);
      expect(await splitter.shares(payee3.address)).to.equal(300);
    });
  });

  describe("Deposits", function () {
    beforeEach(async function () {
      await splitter.connect(owner).addPayee(payee1.address, 100);
      await splitter.connect(owner).addPayee(payee2.address, 200);
    });

    it("Should accept deposits via deposit()", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(
        splitter.connect(other).deposit({ value: depositAmount })
      ).to.emit(splitter, "PaymentReceived")
        .withArgs(other.address, depositAmount);

      expect(await ethers.provider.getBalance(await splitter.getAddress()))
        .to.equal(depositAmount);
    });

    it("Should accept deposits via receive()", async function () {
      const depositAmount = ethers.parseEther("1.0");
      await expect(
        other.sendTransaction({ to: await splitter.getAddress(), value: depositAmount })
      ).to.emit(splitter, "PaymentReceived")
        .withArgs(other.address, depositAmount);
    });

    it("Should not accept zero deposits via deposit()", async function () {
      await expect(
        splitter.connect(other).deposit({ value: 0 })
      ).to.be.revertedWith("No CFX sent");
    });
  });

  describe("Releasing Payments", function () {
    beforeEach(async function () {
      await splitter.connect(owner).addPayee(payee1.address, 100);
      await splitter.connect(owner).addPayee(payee2.address, 200);
    });

    it("Should calculate pending correctly", async function () {
      const depositAmount = ethers.parseEther("3.0");
      await splitter.connect(other).deposit({ value: depositAmount });

      // payee1 should get 100/300 = 1/3 = 1.0 CFX
      expect(await splitter.pending(payee1.address)).to.equal(ethers.parseEther("1.0"));
      
      // payee2 should get 200/300 = 2/3 = 2.0 CFX
      expect(await splitter.pending(payee2.address)).to.equal(ethers.parseEther("2.0"));
    });

    it("Should allow payees to release their payment", async function () {
      const depositAmount = ethers.parseEther("3.0");
      await splitter.connect(other).deposit({ value: depositAmount });

      const initialBalance = await ethers.provider.getBalance(payee1.address);
      const tx = await splitter.connect(payee1).release(payee1.address);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      const finalBalance = await ethers.provider.getBalance(payee1.address);

      // payee1 should receive 1.0 CFX (minus gas)
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("1.0") - gasUsed);
    });

    it("Should emit PaymentReleased event", async function () {
      const depositAmount = ethers.parseEther("3.0");
      await splitter.connect(other).deposit({ value: depositAmount });

      await expect(splitter.connect(payee1).release(payee1.address))
        .to.emit(splitter, "PaymentReleased")
        .withArgs(payee1.address, ethers.parseEther("1.0"));
    });

    it("Should not allow releasing if no shares", async function () {
      await expect(
        splitter.connect(other).release(other.address)
      ).to.be.revertedWith("no shares");
    });

    it("Should not allow releasing if nothing pending", async function () {
      await expect(
        splitter.connect(payee1).release(payee1.address)
      ).to.be.revertedWith("nothing to release");
    });

    it("Should update released amounts after release", async function () {
      const depositAmount = ethers.parseEther("3.0");
      await splitter.connect(other).deposit({ value: depositAmount });

      await splitter.connect(payee1).release(payee1.address);

      expect(await splitter.released(payee1.address)).to.equal(ethers.parseEther("1.0"));
      expect(await splitter.totalReleased()).to.equal(ethers.parseEther("1.0"));
    });

    it("Should allow partial releases over time", async function () {
      // First deposit
      await splitter.connect(other).deposit({ value: ethers.parseEther("3.0") });
      await splitter.connect(payee1).release(payee1.address);
      
      // Second deposit
      await splitter.connect(other).deposit({ value: ethers.parseEther("3.0") });
      
      // payee1 should have 1.0 more pending (total 2.0, already released 1.0)
      expect(await splitter.pending(payee1.address)).to.equal(ethers.parseEther("1.0"));
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple payees with different shares", async function () {
      await splitter.connect(owner).addPayee(payee1.address, 10);
      await splitter.connect(owner).addPayee(payee2.address, 20);
      await splitter.connect(owner).addPayee(payee3.address, 70);

      await splitter.connect(other).deposit({ value: ethers.parseEther("100.0") });

      expect(await splitter.pending(payee1.address)).to.equal(ethers.parseEther("10.0"));
      expect(await splitter.pending(payee2.address)).to.equal(ethers.parseEther("20.0"));
      expect(await splitter.pending(payee3.address)).to.equal(ethers.parseEther("70.0"));
    });

    it("Should handle very small amounts correctly", async function () {
      await splitter.connect(owner).addPayee(payee1.address, 1);
      await splitter.connect(owner).addPayee(payee2.address, 999);

      await splitter.connect(other).deposit({ value: ethers.parseEther("1.0") });

      // payee1 should get 1/1000 = 0.001 CFX
      expect(await splitter.pending(payee1.address)).to.equal(ethers.parseEther("0.001"));
    });
  });
});

