using BowlingServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Data
{
    public class MockScoreData : IScoreData
    {
        private readonly List<Score> scores = new List<Score>();

        public Score AddScore(Score score)
        {
            score.Id = Guid.NewGuid();
            score.CreatedAt = DateTime.Now;
            scores.Add(score);
            return score;
        }

        public void DeleteScore(Score score)
        {
            throw new NotImplementedException();
        }

        public Score EditScore(Score score)
        {
            throw new NotImplementedException();
        }

        public Score GetScore(Guid id)
        {
            throw new NotImplementedException();
        }

        public List<Score> GetScores()
        {
            return scores;
        }

        public List<Score> GetTopScores(int count)
        {
            IEnumerable<Score> topScores = scores.OrderByDescending(i => i.TotalScore).Take(count);
            return topScores.ToList();
        }
    }
}
