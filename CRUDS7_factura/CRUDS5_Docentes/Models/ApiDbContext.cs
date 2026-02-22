using Microsoft.EntityFrameworkCore;

namespace CRUDS5_Docentes.Models
{
    public class ApiDbContext : DbContext
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
            
        }

        public DbSet<DocenteModel> Docente { get; set; }
    }
}
