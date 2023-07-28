using System;
using Firebase.Database;
using Firebase.Database.Query;
namespace AdrianoSenaDev.Models
{
	public class Login
	{public string Nome { get; set; } = string.Empty;
		public string Email { get; set; } = string.Empty;
		public string Senha { get; set; } = string.Empty;


	public static async Task<bool> LoginUser(string email, string senha)
		{

			var result = (await ClientDatabase.Client.Child("User").OnceAsync<Login>()).Where(u => u.Object.Email == email && u.Object.Senha == senha).FirstOrDefault();


			if ( result != null) {

				return true;

			}
			else
			{
				return false;
			}



        }
	}
}

