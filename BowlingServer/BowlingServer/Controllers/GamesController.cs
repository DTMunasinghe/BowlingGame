using BowlingServer.Data;
using BowlingServer.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Controllers
{
    [Route("api/games")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        private readonly IGameData _gameData;

        public GamesController(IGameData gameData)
        {
            _gameData = gameData;
        }

        [HttpGet]
        public IActionResult GetGames()
        {
            var games = _gameData.GetGames();
            return Ok(games);
        }

        [HttpGet("{id}")]
        public IActionResult GetGame(Guid id)
        {
            var game = _gameData.GetGame(id);

            if (game != null)
            {
                return Ok(game);
            }

            return NotFound($"Game with Id: {id} was not found");
        }

        [HttpPost]
        public IActionResult AddGame(Game game)
        {
            _gameData.AddGame(game);
            return Created(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + HttpContext.Request.Path + "/" + game.Id, game);
        }

        //Can use [HttpPatch] to update the score
    }
}
