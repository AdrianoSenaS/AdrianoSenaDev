using System;
using Firebase.Database;

namespace AdrianoSenaDev.Models
{
	public class ClientDatabase
	{
        public static FirebaseClient Client = new FirebaseClient("https://adrianosenadev-default-rtdb.firebaseio.com/");
    }
}

