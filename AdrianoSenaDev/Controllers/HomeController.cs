using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AdrianoSenaDev.Models;

namespace AdrianoSenaDev.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var total = TotalCliks.TotalClik();
        
        return View();
    }

    


    [HttpPost]
    public IActionResult Index(string nome, string email, string menssagem)
    {

        var formulario = new Contato();
        var result = formulario.UserMenssagem(nome, email, menssagem);

        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

