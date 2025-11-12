using Microsoft.AspNetCore.Mvc;
using Movies.Properties.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Movies.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {


        // GET api/movies
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(Movie.Read());
        }

        // POST api/movies
        [HttpPost]
        public IActionResult Post([FromBody] Movie m)
        {
            try
            {
                bool ok = Movie.Insert(m);
                if (!ok) return Conflict("Movie with the same Id already exists.");
                return Ok(m);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/movies/rating/8.5
        [HttpGet("rating/{minRating}")]
        public IActionResult GetMoviesByRating(double minRating)
        {
            var list = Movie.ReadByRating(minRating);
            return Ok(list);
        }

        // GET api/movies/duration?maxMinutes=120
        [HttpGet("duration")]
        public IActionResult GetByDuration([FromQuery] int maxMinutes)
        {
            if (maxMinutes < 0)
                return BadRequest("maxMinutes must be non-negative.");

            var list = Movie.ReadByDuration(maxMinutes);
            return Ok(list);
        }

    }


}
