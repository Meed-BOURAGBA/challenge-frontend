import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantesURL } from '../constantes/constantes-url';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  auth_token = 'tokenTest123';
  shopID = null;

  constructor(private http: HttpClient) {
    // if you want to put on another shop, you will juste have to modify the id in config.json
    this.http.get('../assets/configuration/config.json').subscribe((content: any) => {
      this.shopID = content.shopID;
    })
  }

  /**
   * GET cards
   * @param desiredAmount 
   * @returns 
   */
  getCards(desiredAmount: number): Observable<any> {
    let url = ConstantesURL.ADR_SERVEUR + ConstantesURL.GET_CARDS;
    if (this.shopID != null) {
      url = url.replace('[shopId]', this.shopID);
    }
    const requestParams = new HttpParams().set('amount', desiredAmount);
    const requestOptions: Object = {
      headers: new HttpHeaders().append('Authorization', '' + this.auth_token),
      params: requestParams,
      responseType: 'text'
    }
    return this.http.get(url, requestOptions);
  }
}
