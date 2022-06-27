using BowlingServer.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BowlingServer.Data
{
    public interface IScoreData
    {
        List<Score> GetScores();

        Score GetScore(Guid id);

        Score AddScore(Score score);

        void DeleteScore(Score score);

        Score EditScore(Score score);

        List<Score> GetTopScores(int count);
    }
}
