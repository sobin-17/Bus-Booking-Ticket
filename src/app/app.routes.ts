import { Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { BookTicketComponent } from './pages/book-ticket/book-ticket.component';
import { MyBookingsComponent } from './pages/my-bookings/my-bookings.component';
import { HomeComponent } from './home/home.component';


import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { UserAuthSystemComponent } from './user-auth-system/user-auth-system.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LearnComponent } from './learn/learn.component';


export const routes: Routes = [
    {
        path:"",
        redirectTo:"home",
        pathMatch:"full"
    },
    {
        path:"search",
        component:SearchComponent
    },
    {
        path:"search-result/:from/:to/:date",
        component:SearchResultComponent
    },
    {
        path:"book-ticket/:scheduleId",
        component:BookTicketComponent
    },
    {
        path:"my-booking",
        component:MyBookingsComponent
    },
    {
        path:'home',
        component:HomeComponent

    },

    
    {
        path:'register',
        component:RegisterComponent
    },
    {
        path:'Addusers',
        component:AddUserComponent
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'learn',
        component:LearnComponent
    },
    
   

];
