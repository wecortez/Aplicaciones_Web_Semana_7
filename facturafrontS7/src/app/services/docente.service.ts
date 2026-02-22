import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocenteService {
  RUTA_API = 'https://localhost:7105/api/Docente';

  constructor(private http: HttpClient) {}

  todos(): Observable<any[]> {
    return this.http.get<any[]>(this.RUTA_API);
  }

  uno(iddocente: number): Observable<any> {
    return this.http.get(this.RUTA_API + '/' + iddocente);
  }

  nuevo(docente: any): Observable<any> {
    return this.http.post<any>(this.RUTA_API, docente);
  }

  editar(docente: any): Observable<any> {
    return this.http.put<any>(this.RUTA_API + '/' + docente.id, docente);
  }

  eliminar(iddocente: number): Observable<any> {
    return this.http.delete(this.RUTA_API + '/' + iddocente);
  }
}
