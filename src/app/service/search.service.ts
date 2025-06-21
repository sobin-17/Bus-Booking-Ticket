import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking, IScheduleData } from '../model/model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  apiUrl: string = "https://api.freeprojectapi.com/api/BusBooking/";

  constructor(private http:HttpClient) { }


  searchBus(fromId: string, toId: string, date: string){
    return this.http.get(this.apiUrl +"searchBus?fromLocation="+fromId+"&toLocation="+toId+"&travelDate="+date+"")

  }

  getBusSchedularById(scheduleId: number) :Observable<IScheduleData> {
    return this.http.get<IScheduleData>(`${this.apiUrl}GetBusScheduleById?id=${scheduleId}`)
  }

  createNewBooking(obj:Booking){
    return this.http.post(`${this.apiUrl}PostBusBooking`,obj)
  }

  getBookedSeats(scheduleId:number){
    return this.http.get(`${this.apiUrl}getBookedSeats?shceduleId=${scheduleId}`)
  }
}
