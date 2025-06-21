import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, RouterLink } from '@angular/router';
import { SearchService } from '../../service/search.service';
import { Booking, BusBookingPassenger, IScheduleData } from '../../model/model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-ticket',
  imports: [DatePipe, NgClass, FormsModule,CommonModule,RouterLink],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css'
})
export class BookTicketComponent {
  activatedRoute = inject(ActivatedRoute);
  searchService = inject(SearchService);
  router = inject(Router);
  
  scheduleData!: IScheduleData;
  seatNoList: number[] = [];
  selectedSeatArray: BusBookingPassenger[] = [];
  bookTicketObj: Booking = new Booking();
  bookedSeatList: number[] = [];
  
  // Fare calculation properties
  baseFarePerSeat: number = 500;
  taxPercentage: number = 12;
  baseFare: number = 0;
  tax: number = 0;
  totalAmount: number = 0;
  
  // Payment and booking status
  isBookingInProgress: boolean = false;
  bookingResponse: any = null;
  showPaymentSuccess: boolean = false;
  
  // Payment details
  paymentMethod: string = 'upi';
  paymentMethods = [
    { value: 'upi', label: 'UPI Payment', icon: 'bi-phone' },
    { value: 'card', label: 'Credit/Debit Card', icon: 'bi-credit-card' },
    { value: 'netbanking', label: 'Net Banking', icon: 'bi-bank' },
    { value: 'wallet', label: 'Digital Wallet', icon: 'bi-wallet2' }
  ];

  // UPI Payment Details
  upiPayment = {
    upiId: '',
    selectedApp: ''
  };

  upiApps = [
    { value: 'gpay', label: 'Google Pay', icon: 'bi-google' },
    { value: 'phonepe', label: 'PhonePe', icon: 'bi-phone' },
    { value: 'paytm', label: 'Paytm', icon: 'bi-wallet2' },
    { value: 'bhim', label: 'BHIM UPI', icon: 'bi-bank' }
  ];

  // Card Payment Details
  cardPayment = {
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  };

  // Net Banking Details
  netBankingPayment = {
    selectedBank: ''
  };

  banks = [
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'axis', label: 'Axis Bank' },
    { value: 'kotak', label: 'Kotak Mahindra Bank' },
    { value: 'pnb', label: 'Punjab National Bank' },
    { value: 'canara', label: 'Canara Bank' },
    { value: 'bob', label: 'Bank of Baroda' },
    { value: 'union', label: 'Union Bank of India' },
    { value: 'indian', label: 'Indian Bank' }
  ];

  // Digital Wallet Details
  walletPayment = {
    selectedWallet: 'paytm',
    mobileNumber: ''
  };

  wallets = [
    { value: 'paytm', label: 'Paytm Wallet', icon: 'bi-wallet2' },
    { value: 'phonepe', label: 'PhonePe Wallet', icon: 'bi-phone' },
    { value: 'amazonpay', label: 'Amazon Pay', icon: 'bi-amazon' },
    { value: 'mobikwik', label: 'Mobikwik', icon: 'bi-wallet' }
  ];

  constructor() {
    this.activatedRoute.params.subscribe((res: any) => {
      const scheduleId = res.scheduleId;
      this.bookTicketObj.custId = 10757;
      this.bookTicketObj.scheduleId = scheduleId;
      this.bookTicketObj.bookingDate = new Date();
      this.getBusDetails(scheduleId);
      this.getBookedSeats(scheduleId);
    })
  }

  getBusDetails(scheduleId: number) {
    this.searchService.getBusSchedularById(scheduleId).subscribe((res: IScheduleData) => {
      this.scheduleData = res;
      
      if (this.scheduleData.price) {
        this.baseFarePerSeat = this.scheduleData.price;
      }else if (this.scheduleData.farePerSeat) {
        this.baseFarePerSeat = this.scheduleData.farePerSeat;
      }
      
      for (let index = 1; index <= this.scheduleData.totalSeats; index++) {
        this.seatNoList.push(index)
      }
    })
  }

  getBookedSeats(scheduleId: number) {
    this.searchService.getBookedSeats(scheduleId).subscribe((res: any) => {
      this.bookedSeatList = res;
    })
  }

  checkIfSeatIsSelected(seatNo: number) {
    const check = this.selectedSeatArray.find(m => m.seatNo == seatNo);
    return check !== undefined;
  }

  checkIfBooked(seatNo: number) {
    const check = this.bookedSeatList.find(m => m == seatNo);
    return check !== undefined;
  }

  onSelect(seatNo: number) {
    const isExistIndex = this.selectedSeatArray.findIndex(m => m.seatNo == seatNo);
    if (isExistIndex != -1) {
      this.selectedSeatArray.splice(isExistIndex, 1)
    } else {
      const newPassengerData: BusBookingPassenger = {
        seatNo: seatNo,
        age: 0,
        bookingId: 0,
        gender: '',
        passengerId: 0,
        passengerName: ''
      };
      this.selectedSeatArray.push(newPassengerData)
    }
    this.calculateFare();
  }

  calculateFare() {
    const numberOfSeats = this.selectedSeatArray.length;
    
    if (numberOfSeats === 0) {
      this.baseFare = 0;
      this.tax = 0;
      this.totalAmount = 0;
      return;
    }
    
    this.baseFare = numberOfSeats * this.baseFarePerSeat;
    this.tax = Math.round((this.baseFare * this.taxPercentage) / 100);
    this.totalAmount = this.baseFare + this.tax;
  }

  // Payment Method Validation
  isPaymentDetailsValid(): boolean {
    switch (this.paymentMethod) {
      case 'upi':
        return this.upiPayment.upiId.trim() !== '' && this.isValidUpiId(this.upiPayment.upiId);
      
      case 'card':
        return this.cardPayment.cardNumber.replace(/\s/g, '').length === 16 &&
               this.cardPayment.cardholderName.trim() !== '' &&
               this.cardPayment.expiryDate.length === 5 &&
               this.cardPayment.cvv.length >= 3;
      
      case 'netbanking':
        return this.netBankingPayment.selectedBank !== '';
      
      case 'wallet':
        return this.walletPayment.selectedWallet !== '' &&
               this.walletPayment.mobileNumber.length === 10 &&
               /^[6-9]\d{9}$/.test(this.walletPayment.mobileNumber);
      
      default:
        return false;
    }
  }

  isBookingValid(): boolean {
    if (this.selectedSeatArray.length === 0) {
      return false;
    }
    
    for (let passenger of this.selectedSeatArray) {
      if (!passenger.passengerName || 
          !passenger.age || 
          passenger.age <= 0 || 
          !passenger.gender) {
        return false;
      }
    }
    
    return this.isPaymentDetailsValid();
  }

  // UPI Validation
  isValidUpiId(upiId: string): boolean {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return upiRegex.test(upiId);
  }

  // Card Number Formatting
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    this.cardPayment.cardNumber = formattedValue;
  }

  // Expiry Date Formatting
  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardPayment.expiryDate = value;
  }

  // CVV Input Restriction
  restrictCvvInput(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    this.cardPayment.cvv = value.substring(0, 4);
  }

  // Mobile Number Validation for Wallet
  formatMobileNumber(event: any) {
    const value = event.target.value.replace(/\D/g, '');
    this.walletPayment.mobileNumber = value.substring(0, 10);
  }

  // Reset payment forms when method changes
  onPaymentMethodChange() {
    this.upiPayment = { upiId: '', selectedApp: '' };
    this.cardPayment = { cardNumber: '', cardholderName: '', expiryDate: '', cvv: '', saveCard: false };
    this.netBankingPayment = { selectedBank: '' };
    this.walletPayment = { selectedWallet: 'paytm', mobileNumber: '' };
  }

  // Simulate payment processing
  async processPayment(): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate payment gateway delay
      setTimeout(() => {
        // Simulate 95% success rate
        const isSuccess = Math.random() > 0.05;
        resolve(isSuccess);
      }, 2000);
    });
  }

  async bookTicket() {
    if (!this.isBookingValid()) {
      alert("Please fill all passenger details, select seats, and complete payment information");
      return;
    }
    
    this.isBookingInProgress = true;
    
    try {
      // Step 1: Process Payment
      const paymentSuccess = await this.processPayment();
      
      if (!paymentSuccess) {
        alert("Payment failed. Please try again.");
        this.isBookingInProgress = false;
        return;
      }
      
      // Step 2: Create Booking after successful payment
      this.bookTicketObj.totalAmount = this.totalAmount;
      this.bookTicketObj.busBookingPassengers = this.selectedSeatArray;
      this.bookTicketObj.paymentMethod = this.paymentMethod;
      this.bookTicketObj.paymentStatus = 'SUCCESS';
      this.bookTicketObj.transactionId = this.generateTransactionId();
      
      this.searchService.createNewBooking(this.bookTicketObj).subscribe({
        next: (res: any) => {
          this.bookingResponse = res;
          this.showPaymentSuccessModal();
          this.isBookingInProgress = false;
        },
        error: (error) => {
          console.error("Booking error:", error);
          alert("Booking failed after payment. Please contact support with your transaction details.");
          this.isBookingInProgress = false;
        }
      });
      
    } catch (error) {
      console.error("Payment processing error:", error);
      alert("An error occurred during payment processing. Please try again.");
      this.isBookingInProgress = false;
    }
  }

  showPaymentSuccessModal() {
    this.showPaymentSuccess = true;
    
    // Auto-redirect after 5 seconds
    setTimeout(() => {
      this.goToBookingHistory();
    }, 5000);
  }

  generateTransactionId(): string {
    return 'TXN' + Date.now() + Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  generateBookingId(): string {
    return 'BKG' + Date.now() + Math.random().toString(36).substring(2, 6).toUpperCase();
  }

  goToBookingHistory() {
    this.router.navigate(['/booking-history']);
  }

  bookAnotherTicket() {
    this.resetBookingForm();
    this.showPaymentSuccess = false;
  }

  resetBookingForm() {
    this.selectedSeatArray = [];
    this.calculateFare();
    this.bookingResponse = null;
    this.isBookingInProgress = false;
    // Reset payment forms
    this.onPaymentMethodChange();
  }

  downloadTicket() {
    // Implement ticket download functionality
    alert("Ticket download feature will be implemented");
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getSelectedPaymentMethod() {
    return this.paymentMethods.find(method => method.value === this.paymentMethod);
  }
}