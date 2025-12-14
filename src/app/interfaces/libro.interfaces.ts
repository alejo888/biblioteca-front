export interface Libro {
    _id?: string;
    titulo: string;
    autor: string;
    apublicacion: string;
    editorial: string;
    categoria: string;
    sede: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface LibrosResponse {
    libros?: Libro[];
    libro?: Libro;
    message?: string;
    success?: boolean;
}