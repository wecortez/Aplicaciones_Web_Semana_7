import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DocenteService } from '../../../services/docente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-docente',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './nuevo-docente.html',
  styleUrl: './nuevo-docente.css',
})
export class NuevoDocente {
  titulo = false;
  idDocente = 0;

  frmDocente: FormGroup = new FormGroup({
    id: new FormControl<number | null>(null),
    nombres: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    apellidos: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    materia: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    telefono: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    servicio: new FormControl('', [Validators.required]),
    cantidad: new FormControl('', [Validators.required]),
    precio: new FormControl('', [Validators.required]),
    iva: new FormControl('', [Validators.required]),
  });

  constructor(
    private docenteServicio: DocenteService,
    private rutas: Router,
    private parametros: ActivatedRoute,
  ) {
    this.parametros.paramMap.subscribe((valores) => {
      const id = Number(valores.get('id'));
      if (id > 0) {
        this.titulo = true;
        this.docenteServicio.uno(id).subscribe((docente) => {
          this.idDocente = docente.id;
          this.frmDocente.patchValue({
            id: docente.id,
            nombres: docente.nombres,
            apellidos: docente.apellidos,
            materia: docente.materia,
            telefono: docente.telefono,
            email: docente.email,
            servicio: docente.servicio,
            cantidad: docente.cantidad,
            precio: docente.precio,
            iva: docente.iva,
          });
        });
      }
    });
  }

  guardar() {
    const datos = this.frmDocente.getRawValue();

    const docenteModel = {
      id: Number(datos.id ?? 0),
      nombres: datos.nombres.trim(),
      apellidos: datos.apellidos.trim(),
      materia: datos.materia.trim(),
      telefono: datos.telefono.trim(),
      email: datos.email.trim(),
      servicio: datos.servicio.trim(),
      cantidad: datos.cantidad,
      precio: datos.precio,
      iva: datos.iva,
    };    

    if (this.titulo) {
      this.docenteServicio.editar(docenteModel).subscribe((response) => {
        if (response == null) {
          Swal.fire('Actualizado', 'Docente actualizado con éxito', 'success');
          this.rutas.navigate(['/docentes']);
        }
      });
    } else {
      this.docenteServicio.nuevo(docenteModel).subscribe((response) => {
        if (response.id > 0) {
          Swal.fire('Guardado', 'Docente registrado con éxito', 'success');
          this.rutas.navigate(['/docentes']);
        }
      });
    }
  }
}
