using System;
using Firebase.Database;
using Firebase.Database.Query;
namespace AdrianoSenaDev.Models
{
	public class TotalCliks
	{
        public static DateTime data = DateTime.Now;
        public string Dia { get; set; } = string.Empty;
        public string Mes { get; set; } = string.Empty;
        public string Ano { get; set; } = string.Empty;

        public static async Task TotalClik()
		{
			
			await ClientDatabase.Client.Child("TotalCliquesSite").PostAsync(new TotalCliks
			{
				Dia = TotalCliks.data.Day.ToString(),
				Mes = TotalCliks.data.Month.ToString(),
				Ano = TotalCliks.data.Year.ToString()

			}) ;

        }

		public static async Task<int> GetCliks()
		{
			var result = await ClientDatabase.Client.Child("TotalCliquesSite").OnceAsync<TotalCliks>();


			return result.Count;
		}

		
	}
}

