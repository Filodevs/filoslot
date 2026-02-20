import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Footer } from '../components/footer/footer';
import { Navbar } from '../components/navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterModule, Navbar, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {}
