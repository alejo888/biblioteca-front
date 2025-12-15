import { Component, computed, inject, signal } from '@angular/core';
import { LibroService } from '../../services/libro';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../interfaces/libro.interfaces';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-libro',
  imports: [FormsModule],
  templateUrl: './libro.html',
  styleUrl: './libro.css',
})
export class LibroComponent {
  libroService = inject(LibroService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  libroId = signal<string>('');

  editando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  eliminando = signal<string | null>(null);
  errorEdicion = signal<string | null>(null);

  libroEditado = signal<Libro>({
    titulo: '',
    autor: '',
    apublicacion: '',
    editorial: '',
    categoria: '',
    sede: '',
  });

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
    if (this.libro()) {
      this.libroEditado.set({ ...this.libro()! });
      this.errorEdicion.set(null); // Limpiar error de edicion
      this.editando.set(true);
    }
  }

  cancelarEdicion() {
    this.editando.set(false);
    this.errorEdicion.set(null);
    if (this.libro()) {
      this.libroEditado.set({ ...this.libro()! });
    }
  }

  guardarCambios() {
    if (this.guardando() || !this.libro()) return;
    this.guardando.set(true);
    this.errorEdicion.set(null);

    this.libroService.actualizarLibro(this.libroId(), this.libroEditado()).subscribe({
      next: (response: any) => {
        if (response.success === true && response.libro) {
          this.libroResource.reload();
          this.editando.set(false);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && error.error.msg) {
          this.errorEdicion.set(error.error.msg);
        } else {
          this.errorEdicion.set('Error al actualizar el libro');
        }
        this.guardando.set(false);
      },
      complete: () => {
        this.editando.set(false);
        this.guardando.set(false);
      }
    });
  }

  eliminarLibro() {
    // this.eliminando.set(true);
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
