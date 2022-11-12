import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConstantesURL } from '../constantes/constantes-url';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  auth_token = 'tokenTest123';
  shopId = null;

  constructor(private http: HttpClient) {
    this.http.get('../assets/configuration/config.json').subscribe((content: any) => {
      this.shopId = content.shopId;
    })
  }

  /**
   * GET cards
   * @param desiredAmount 
   * @returns 
   */
  getCards(desiredAmount: number): Observable<any> {
    let url = ConstantesURL.ADR_SERVEUR + ConstantesURL.GET_CARDS;
    if (this.shopId != null) {
      url = url.replace('[shopId]', this.shopId);
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
