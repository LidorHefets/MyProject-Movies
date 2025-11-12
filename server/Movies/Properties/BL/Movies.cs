namespace Movies.Properties.BL
{
    public class Movie
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public double Rating { get; set; }
        public double Income { get; set; }
        public int Duration { get; set; }
        public string Language { get; set; }

        public string Description { get; set; }
        public string Director { get; set; }
        public int ReleaseYear { get; set; }
        public string Genre { get; set; }
        public string PhotoURL { get; set; }


        public static List<Movie> movies = new List<Movie>();

        public static bool Insert(Movie m)
        {
            try
            {
                foreach (Movie movie in movies)
                {
                    if (m.Id == movie.Id)   // היה m.Id == Id
                        return false;       // כבר קיים סרט עם אותו Id
                }
                movies.Add(m);               // היה this
                return true;
            }
            catch
            {
                return false;
            }
        }
    
        
        public static List<Movie> Read()
        {
            return movies;
        }

        public static List<Movie> ReadByRating(double minRating)
        {
            List<Movie> result = new List<Movie>();
            foreach (var m in movies)
            {
                if (m.Rating >= minRating)
                    result.Add(m);
            }
            return result;
        }

        public static List<Movie> ReadByDuration(int maxMinutes)
        {
            List<Movie> result = new List<Movie>();
            foreach (var m in movies)
            {
                if (m.Duration <= maxMinutes)
                    result.Add(m);
            }
            return result;
        }


    }
}
