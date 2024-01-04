import { useContext, useEffect, useState } from "react"
import MessageContext from "../messageCtx";
import API from "../API";
import Loading from "./Loading";
import { Col, Row } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";

function Cv(props) {
    const { studentID, loading, setLoading } = props
    const { handleToast } = useContext(MessageContext);
    const [student, setStudent] = useState({})
    const [cv, setCv] = useState([])
    const isMobile = useMediaQuery({ maxWidth: 767 });
    
    useEffect(() => {

        const getCV = async (studentID) => {
            try {
                let cv = await API.getStudentCv(studentID)
                let student = await API.getStudent(studentID)
                setCv(cv)
                setStudent(student[0])
                setLoading(false)
                console.log('cv', JSON.stringify(cv))
                console.log('student', JSON.stringify(student))

            }
            catch (error) {
                handleToast('Error fetching CV')
            }

        }
        setLoading(true)
        getCV(studentID)
    }, [studentID])

    return (
        loading ? <Loading /> : (
            <>
                <Row>
                    <Col xs={8}>
                        <Row>
                            {student.name + ' ' + student.surname}
                        </Row>
                        <Row>
                            {studentID}
                        </Row>
                    </Col>
                    <Col xs={8} style={{justifyContent:'flex-end'}}>
                        <Row>
                            {'degree: '}
                            {student.cod_degree}
                        </Row>
                        <Row>
                            {'enrolled from : '}
                            {student.enrollment_year}
                        </Row>
                    </Col>
                </Row>
            </>

        )



    )
}
export default Cv