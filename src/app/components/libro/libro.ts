import { Component, computed, inject, signal } from '@angular/core';
import { LibroService } from '../../services/libro';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-libro',
  imports: [],
  templateUrl: './libro.html',
  styleUrl: './libro.css',
})
export class Libro {
  libroService = inject(LibroService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  libroId = signal<string>('');

  editando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  eliminando = signal<string | null>(null);
  errorEdicion = signal<string | null>(null);

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

  iniciarEdicion() {
    // this.editando.set(true);
  }

  eliminarLibro() {
    // this.eliminando.set(true);
  }

  cancelarEdicion() {
    // this.editando.set(false);
  }

  volver() {
    this.router.navigate(['/lists']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';

    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
