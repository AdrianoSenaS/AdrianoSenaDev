using System;
using Firebase.Database;
using Firebase.Database.Query;
namespace AdrianoSenaDev
{
	public class Contato
	{
		public static FirebaseClient Client = new FirebaseClient("https://adrianosenadev-default-rtdb.firebaseio.com/");
		public string Nome { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Menssagem { get; set; } = string.Empty;

	public async Task UserMenssagem(string nome, string email, string messagem)
		{
			await Client.Child("Formulario").PostAsync(new Contato {

				Nome = nome,
				Email = email,
				Menssagem = messagem

			});

		}
	}
}

