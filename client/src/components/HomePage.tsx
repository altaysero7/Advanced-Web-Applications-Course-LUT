import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
    const navigate = useNavigate();

    return (
        <Container className="mt-5">
            <Row className="justify-content-md-center">
                <Col md="auto" className="text-center">
                    <h1 className="mb-4">Welcome to FakeTinder</h1>
                    <Button
                        variant="primary"
                        className="scale-on-hover me-2"
                        onClick={() => navigate('/login')}>
                        Login
                    </Button>
                    <Button
                        variant="secondary"
                        className="scale-on-hover"
                        onClick={() => navigate('/register')}>
                        Register
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;
