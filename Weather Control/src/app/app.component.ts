import { Component, ViewChild, OnInit, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import {} from 'googlemaps';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  @ViewChild('search', {static: false})
  private searchElement: ElementRef;
  private location: FormControl;
  private longitude: number;
  private latitude: number;

  constructor(private coordinate: MapsAPILoader, private ngZone: NgZone){}

  ngOnInit() {

    this.location = new FormControl();
    this.coordinate.load().then(() =>{
        const autoComplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {
          types: [],
          componentRestrictions: {'country': 'USA'}
        });
        autoComplete.addListener('place_change', () =>{
          this.ngZone.run(() =>{
              const place: google.maps.places.PlaceResult= autoComplete.getPlace();
              if(place.geometry === undefined || place.geometry === null){
                return;
              }
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
    console.log(this.latitude+" "+this.longitude);
  }
}
