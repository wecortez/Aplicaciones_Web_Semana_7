namespace CRUDS5_Docentes.Models
{
    public class DocenteModel
    {
        public int Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public string Materia { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Servicio { get; set; }
        public int Cantidad { get; set; }
        public decimal Precio { get; set; }
        public decimal Iva { get; set; }
    }
}
