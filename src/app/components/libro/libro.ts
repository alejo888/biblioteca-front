import { Component, computed, inject, signal } from '@angular/core';
import { LibroService } from '../../services/libro';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-libro',
  imports: [],
  templateUrl: './libro.html',
  styleUrl: './libro.css',
})
export class Libro {
  libroService = inject(LibroService);
  route = inject(ActivatedRoute);
  libroId = signal<string>('');

  // Obtener libro especifico
  libroResource = this.libroService.libroDetalleResource(() => this.libroId());

  libro = computed(() => {
    const response = this.libroResource.value();
    return response?.libro || null;
  });

  isLoadingLibro = computed(() => {
    return this.libroResource.isLoading();
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.libroId.set(id);
    }
  }
}
