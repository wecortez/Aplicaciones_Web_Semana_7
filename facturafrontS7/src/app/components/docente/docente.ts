import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocenteService } from '../../services/docente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docente',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './docente.html',
  styleUrl: './docente.css',
})
export class Docente implements OnInit {
  listaDocentes = signal<any[]>([]);
  private readonly IVA_RATE = 0.15;

  constructor(private readonly docenteService: DocenteService) {}

  ngOnInit(): void {
    this.cargarLista();
  }

  cargarLista() {
    this.docenteService.todos().subscribe((lista) => {
      this.listaDocentes.set(Array.isArray(lista) ? lista : []);
    });
  }

  eliminar(id: number) {
    Swal.fire({
      title: '¿Desea eliminar el registro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
    }).then((result) => {
      if (result.isConfirmed) {
        this.docenteService.eliminar(id).subscribe((response) => {
          if (response == null) {
            Swal.fire('Eliminado', 'El docente fue eliminado con éxito', 'success');
            this.cargarLista();
          }
        });
      }
    });
  }

  imprimirProforma(docente: any) {
    const cantidad = Number(docente?.cantidad ?? 1);
    const precio = Number(docente?.precio ?? 0);

    const subtotal = +(cantidad * precio).toFixed(2);
    const totalIva = +(subtotal * this.IVA_RATE).toFixed(2);
    const total = +(subtotal + totalIva).toFixed(2);

    const hoy = new Date();
    const fecha = hoy.toLocaleDateString('es-EC');

    const vence = new Date(hoy);
    vence.setDate(vence.getDate() + 15);

    const numero = `${hoy.getFullYear()}${String(docente?.id ?? 0).padStart(5, '0')}`;
    const nombreDocente = `${docente?.nombres ?? ''} ${docente?.apellidos ?? ''}`.trim();

    const data = {
      numero,
      fecha,
      ivaRate: this.IVA_RATE,
      empresa: {
        nombre: 'UNIANDES',
        ruc: '1799999999001',
        direccion: 'Latacunga, Ecuador',
        telefono: '+593 03 2xx xxxx',
        email: 'info@uniandes.edu.ec',
      },
      cliente: {
        nombre: nombreDocente || 'Docente',
        ci: `0102${String((docente?.id ?? 1) * 987).padStart(6, '0')}`,
        materia: docente?.materia ?? 'N/A',
        telefono: docente?.telefono ?? 'N/A',
        email: docente?.email ?? 'N/A',
      },
      detalle: {
        descripcion: 'Servicios profesionales (docencia)',
        servicio: docente?.servicio ?? 'Honorarios',
        cantidad,
        precio: +precio.toFixed(2),
        totalLinea: subtotal,
      },
      subtotal,
      totalIva,
      total,
    };

    const html = this.buildProformaHTML(data);
    const win = window.open('', '_blank', 'width=900,height=1000');

    if (!win) return;

    win.document.open();
    win.document.write(html);
    win.document.close();

    win.onload = () => {
      win.focus();
      win.print();
      win.onafterprint = () => win.close();
    };
  }

  private buildProformaHTML(p: any): string {
    const ivaPct = Math.round(p.ivaRate * 100);

    return `
<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Factura</title>
<style>
  @page { size: A4; margin: 12mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Arial, Helvetica, sans-serif; color: #0d2b1f; }
  .sheet { width: 210mm; min-height: 297mm; margin: 0 auto; background: #fff; }
  .topbar { background: #cfeeda; padding: 14px 18px; display: flex; align-items: center; gap: 12px; }
  .logo { width: 44px; height: 44px; border: 3px solid #2d6b45; position: relative; }
  .logo:before { content: ""; position: absolute; inset: 8px; border: 3px solid #2d6b45; }
  .brand-title { font-weight: 900; letter-spacing: 1px; font-size: 18px; }
  .brand-sub { font-size: 12px; opacity: .85; margin-top: 2px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding: 18px; }
  .title { font-size: 42px; font-weight: 900; margin: 0; }
  .proforma-box { text-align: right; }
  .proforma-box .label { font-size: 12px; font-weight: 800; color: #1c5a3a; }
  .proforma-box .num { font-size: 20px; font-weight: 900; margin-top: 6px; }
  .divider { height: 2px; background: #2d6b45; margin: 0 18px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr 260px; gap: 14px; padding: 14px 18px; }
  .block-title { font-size: 12px; font-weight: 900; color: #1c5a3a; margin-bottom: 10px; }
  .line { font-size: 12px; margin: 6px 0; }
  .tag { display: inline-block; width: 78px; font-weight: 800; color: #2d6b45; }
  .strong { font-weight: 900; }
  .dates { border-left: 2px solid #2d6b45; padding-left: 12px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }
  .dates-row { display: flex; justify-content: space-between; font-size: 12px; }
  .dates-label { font-weight: 900; color: #1c5a3a; }
  .table { width: calc(100% - 36px); margin: 14px 18px; border-collapse: collapse; font-size: 12px; }
  .table th { background: #cfeeda; border: 1px solid #2d6b45; padding: 12px; text-align: left; font-weight: 900; }
  .table td { border: 1px solid #2d6b45; padding: 12px; vertical-align: top; }
  .center { text-align: center; }
  .right { text-align: right; }
  .muted { opacity: .75; margin-top: 8px; }
  .totals { display: flex; justify-content: flex-end; padding: 0 18px 18px; }
  .totals-box { width: 340px; background: #e8f8ee; border: 1px solid #2d6b45; padding: 14px; }
  .trow { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #b8e0c4; font-size: 12px; }
  .trow:last-child { border-bottom: none; }
  .tlabel { font-weight: 900; color: #1c5a3a; }
  .tvalue { font-weight: 900; }
  .trow.total { font-size: 18px; padding-top: 14px; }
  .footer { padding: 14px 18px 18px; }
  .footer-title { font-size: 12px; font-weight: 900; margin: 0 0 6px; }
  .footer-text { font-size: 12px; opacity: .85; margin: 0; }
  @media print { * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="topbar">
      <div class="logo"></div>
      <div>
        <div class="brand-title">UNIANDES</div>
        <div class="brand-sub">Universidad Regional Autónoma de los Andes</div>
      </div>
    </div>

    <div class="header">
      <h1 class="title">FACTURA</h1>
      <div class="proforma-box">
        <div class="label">NÚMERO FACTURA</div>
        <div class="num">#${p.numero}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="grid">
      <div>
        <div class="block-title">NOMBRE DE EMPRESA</div>
        <div class="line strong">${p.empresa.nombre}</div>
        <div class="line"><span class="tag">RUC</span>${p.empresa.ruc}</div>
        <div class="line"><span class="tag">Dirección</span>${p.empresa.direccion}</div>
        <div class="line"><span class="tag">Teléfono</span>${p.empresa.telefono}</div>
        <div class="line"><span class="tag">Email</span>${p.empresa.email}</div>
      </div>

      <div>
        <div class="block-title">FACTURAR A</div>
        <div class="line strong">${p.cliente.nombre}</div>
        <div class="line"><span class="tag">CI</span>${p.cliente.ci}</div>
        <div class="line"><span class="tag">Materia</span>${p.cliente.materia}</div>
        <div class="line"><span class="tag">Teléfono</span>${p.cliente.telefono}</div>
        <div class="line"><span class="tag">Email</span>${p.cliente.email}</div>
      </div>

      <div class="dates">
        <div class="dates-row"><span class="dates-label">FECHA</span><span>${p.fecha}</span></div>
      </div>
    </div>

    <div class="divider"></div>

    <table class="table">
      <thead>
        <tr>
          <th>DESCRIPCIÓN</th>
          <th class="center">CANTIDAD</th>
          <th class="right">PRECIO</th>
          <th class="right">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="strong">${p.detalle.descripcion}</div>
            <div class="muted">Servicio: ${p.detalle.servicio}</div>
          </td>
          <td class="center">${p.detalle.cantidad}</td>
          <td class="right">$ ${Number(p.detalle.precio).toFixed(2)}</td>
          <td class="right">$ ${Number(p.detalle.totalLinea).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="trow"><span class="tlabel">SUBTOTAL</span><span class="tvalue">$ ${Number(p.subtotal).toFixed(2)}</span></div>
        <div class="trow"><span class="tlabel">IVA</span><span class="tvalue">${ivaPct}%</span></div>
        <div class="trow"><span class="tlabel">TOTAL IVA</span><span class="tvalue">$ ${Number(p.totalIva).toFixed(2)}</span></div>
        <div class="trow total"><span class="tlabel">TOTAL</span><span class="tvalue">$ ${Number(p.total).toFixed(2)}</span></div>
      </div>
    </div>

    <div class="footer">
      <div class="footer-title">CONDICIONES Y FORMAS DE PAGO</div>
      <p class="footer-text">Pago al contado. Documento generado para fines académicos.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}