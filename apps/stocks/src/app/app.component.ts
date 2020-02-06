import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'coding-challenge-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stocks Price';
  pageHeading = 'Stocks Price';
  constructor(private titleService: Title){   
  }
  ngOnInit(): void{
    this.titleService.setTitle(this.title);
  }
}
