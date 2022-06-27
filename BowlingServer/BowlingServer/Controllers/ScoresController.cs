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
    [Route("api/scores")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly IScoreData _scoreData;

        public ScoresController(IScoreData scoreData)
        {
            _scoreData = scoreData;
        }

        [HttpGet]
        public IActionResult GetScores()
        {
            var scores = _scoreData.GetScores();
            return Ok(scores);
        }

        [HttpGet("top-scores/{count}")]
        public IActionResult GetTopScores(int count)
        {
            var scores = _scoreData.GetTopScores(count);
            return Ok(scores);
        }

        [HttpPost]
        public IActionResult AddScore(Score score)
        {
            _scoreData.AddScore(score);
            return Created(HttpContext.Request.Scheme + "://" + HttpContext.Request.Host + HttpContext.Request.Path + "/" + score.Id, score);
        }

    }
}
