import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private url = environment.weatherUrl;
  private units = environment.units;

  constructor(private http: HttpClient) { }

  public getWeaterByCoordinates(latitude: any, longitude: any){
    return this.http.get<any>(`${this.url}${latitude},${longitude}${this.units}`);   
  }
}
