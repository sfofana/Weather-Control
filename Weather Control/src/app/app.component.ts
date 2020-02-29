import { Component, ViewChild, OnInit, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';
import { FormControl } from '@angular/forms';
import { Coordinate } from './models/coordinate';
import { WeatherService } from './services/weather.service';
import { Weather } from './models/weather';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('search', {static: false})
  private searchElement: ElementRef;
  private location: FormControl;
  coordinate = new Coordinate();
  weather = new Weather();
  private longitude: number;
  private latitude: number;

  constructor(private mapLoad: MapsAPILoader, private ngZone: NgZone, private service: WeatherService){}

  ngOnInit() {

    this.location = new FormControl();
    this.setPosition();
    this.mapLoad.load().then(() =>{
        const autoComplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
          types: [],
          componentRestrictions: {'country': 'USA'}
        });
        autoComplete.addListener('place_changed', () =>{
          this.ngZone.run(() =>{
              const place: google.maps.places.PlaceResult= autoComplete.getPlace();
              if(place.geometry === undefined || place.geometry === null){
                return;
              }
              
              this.coordinate.latitude = place.geometry.location.lat();
              this.coordinate.longitude = place.geometry.location.lng();                       
              this.location.reset();
          });
        });
    });
  }

  private setPosition(){
    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition((position) =>{
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    }
  }

  output(){
    console.log(this.coordinate);
    this.service.getWeaterByCoordinates(this.coordinate.latitude,this.coordinate.longitude).subscribe(data=>this.weather=data.data.currently);
    console.dir(this.weather);
  }
}
