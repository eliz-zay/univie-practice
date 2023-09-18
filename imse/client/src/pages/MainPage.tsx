function MainPage() {
  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      To use the application, press <span className="text-primary">"Fill SQL"</span> on the navigation bar
      and then choose user from the <span className="text-success">"Choose User"</span> dropdown.
      After you can see the tables from the navigation bar. 
      To migrate the data to NoSQL, press the button <span className="text-warning">"Migrate NoSQL"</span>
    </div>
  );
}

export default MainPage;
