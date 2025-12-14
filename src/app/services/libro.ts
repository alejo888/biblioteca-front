import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LibrosResponse } from '../interfaces/libro.interfaces';

@Injectable({
  providedIn: 'root',
})
export class LibroService {
  http = inject(HttpClient);
  baseUrl = environment.url;

  private dataUrl = `${this.baseUrl}lists`;

  librosResource = httpResource<LibrosResponse>(() => this.dataUrl, {
    defaultValue: { libros: [], success: true }

  });

  // Detalle libro especifico
  libroDetalleResource = (id: () => string) => httpResource<LibrosResponse>(
    () => {
      const _id = id();
      return _id ? `${this.dataUrl}/${_id}` : undefined;
    }
  );
}
