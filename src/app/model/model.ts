export class Search{
    fromLocationId: string;
    toLocationId: string;
    date: string;

    constructor(){
        this.fromLocationId = "";
        this.toLocationId = "";
        this.date= "";
    }
}

export interface ISearchBus {
  busType: string;
id: any|string;
rating: any;
duration: any;
    availableSeats: number
    totalSeats: number
    price: number
    arrivalTime: string
    scheduleId: number
    departureTime: string
    busName: string
    busVehicleNo: string
    fromLocationName: any
    toLocationName: any
    vendorName: any
    scheduleDate: string
    vendorId: number
  }

  export interface IScheduleData {
    farePerSeat: number;
    scheduleId: number
    vendorId: number
    busName: string
    busVehicleNo: string
    fromLocation: number
    toLocation: number
    departureTime: string
    arrivalTime: string
    scheduleDate: string
    price: number
    totalSeats: number
  }

  export class Booking {
    bookingId: number
    custId: number
    bookingDate: Date
    scheduleId: number
    busBookingPassengers: BusBookingPassenger[];
    totalAmount: number | undefined;
transactionId: any;
    paymentMethod: string | undefined;
    paymentStatus: string | undefined;

    constructor(){
        this.bookingId=0;
        this.custId=0;
        this.bookingDate= new Date();
        this.scheduleId=0;
        this.busBookingPassengers=[]
    }
  }
  
  export class BusBookingPassenger {
    passengerId: number;
    bookingId: number;
    passengerName: string;
    age: number;
    gender: string;
    seatNo: number;

    constructor(){
        this.passengerId = 0;
        this.bookingId = 0;
        this.age = 0;
        this.passengerName = "";
        this.gender="";
        this.seatNo =0;
    }
  }
  