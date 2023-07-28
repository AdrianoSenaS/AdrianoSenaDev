using System;
using AdrianoSenaDev.Models;
using Firebase.Database;
using Firebase.Database.Query;
namespace AdrianoSenaDev
{
	public class Contato
	{
		
		public string Nome { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Menssagem { get; set; } = string.Empty;

	public  async Task UserMenssagem(string nome, string email, string messagem)
		{
			await ClientDatabase.Client.Child("Formulario").PostAsync(new Contato {

				Nome = nome,
				Email = email,
				Menssagem = messagem

			});

		}
	
		public static async Task<List<Contato>> GetAll()
		{

		 var  values = await ClientDatabase.Client.Child("Formulario").OnceAsync<Contato>();



                return values.AsEnumerable().Select(item => new Contato
                {
                    Nome = item.Object.Nome,
                    Email = item.Object.Email,
                    Menssagem = item.Object.Menssagem

                }).ToList();


			
			

		}
	}

}

