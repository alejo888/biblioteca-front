import { Component, computed, inject, signal } from '@angular/core';
import { LibroService } from '../../services/libro';
import { FormsModule } from '@angular/forms';
import { Libro } from '../../interfaces/libro.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  imports: [FormsModule],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista {
  libroService = inject(LibroService);

  router = inject(Router);

  mostrarFormulario = signal<boolean>(false);

  guardando = signal<boolean>(false);

  eliminando = signal<string | null>(null);

  // Esto va a limpiar el formulario cuando se crea un libro
  errorCreacion = signal<string | null>(null);

  nuevoLibro: Libro = {
    titulo: '',
    autor: '',
    apublicacion: '',
    editorial: '',
    categoria: '',
    sede: '',
    _id: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  };

  libros = computed(() => {
    const response = this.libroService.librosResource.value();
    return response?.libros || [];
  });

  isLoadingLibros = computed(() => {
    return this.libroService.librosResource.isLoading();
  });

  hasErrorLibros = computed(() => {
    return this.libroService.librosResource.error();
  });

  guardarLibro() {
    if (this.guardando()) return;

    this.guardando.set(true);
    this.errorCreacion.set(null);

    this.libroService.crearLibro(this.nuevoLibro).subscribe({
      next: (response: any) => {
        if (response.success === true && response.libro) {
          this.cancelarFormulario();
          this.libroService.refetchLibros();
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && error.error.msg) {
          this.errorCreacion.set(error.error.msg);
        } else {
          this.errorCreacion.set('Error al crear el libro. Intente de nuevo.');
        }
      },
      complete: () => {
        this.guardando.set(false);
      },
    });
  }

  cancelarFormulario() {
    this.mostrarFormulario.set(false);
    this.errorCreacion.set(null);
    this.nuevoLibro = {
      titulo: '',
      autor: '',
      apublicacion: '',
      editorial: '',
      categoria: '',
      sede: '',
      _id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }

  verDetalle(id: string) {
    this.router.navigate(['/lists', id]);
  }

  eliminarLibro(id: string) {
    if (this.eliminando() || !id) return;
    this.eliminando.set(id);
    this.libroService.eliminarLibro(id).subscribe({
      next: (response: any) => {
        if (response.success === true) {
          this.router.navigate(['/lists']);
          this.libroService.refetchLibros();
        }
      },
      error: (error: HttpErrorResponse) => {
        this.eliminando.set(null);
      },
      complete: () => {
        this.eliminando.set(null);
      }
    });
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
