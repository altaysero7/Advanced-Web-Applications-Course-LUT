function HomePage() {

    return (
        <div>
            <div>HOME PAGE</div>
            <button onClick={() => window.location.replace('/login')}>Login</button>
            <br />
            <button onClick={() => window.location.replace('/register')}>Register</button>
        </div>
    )
}

export default HomePage;
