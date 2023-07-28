using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AdrianoSenaDev.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace AdrianoSenaDev.Controllers
{
    public class AdminController : Controller
    {
        
        public static bool login;
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

      


        public IActionResult Dashboard(String email, string senha)
        {
            var result = Login.LoginUser(email, senha);

            if (result.Result == true)
            {
                

                return View();

            }else if (login== true)
            {
                return View();
            }

            else
            {
                return Redirect("/Admin");
            }

        }
    }
}

