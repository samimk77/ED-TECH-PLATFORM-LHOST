import './App.css'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/common/Navbar'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import Login from './pages/Login'
import Catalog from './pages/Catalog'
import Footer from './components/common/footer'
import CourseDetails from './pages/CourseDetails'
import Dashboard from './components/dashboard/Dashboard'
import MyProfile from './components/dashboard/MyProfile'
import About from './pages/About'
import Cart from './components/dashboard/Cart'
import EnrolledCourses from './pages/EnrolledCourses'
import AddCourse from './components/dashboard/createCourse'
import CreateCategory from './components/dashboard/CreateCategory'
import ModifyCourse from './pages/ModifyCourse'
import ManageStudents from './pages/ManageStudents'
import ManageInstructors from './pages/ManageInstructors'
import Contact from './pages/Contact'

function App() {

  return (
   
   <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter '>
    <Navbar/>
    <Routes>
    <Route path='/' element={<Home/>}  />
    <Route path='/about' element={<About/>}/>
    <Route path='/dashboard/cart' element={<Cart/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/catalog/:catalogId" element={<Catalog />} />
    <Route path='/course/:courseId' element={<CourseDetails/>}/>
    
   <Route path="/dashboard/edit-course/:courseId" element={<ModifyCourse />} />

   <Route path='/contact' element={<Contact/>}/>

    <Route path='/dashboard' element={<Dashboard/>}>
        <Route path="profile" element={<MyProfile />} />
        <Route path='getAllEnrolledCourses' element={<EnrolledCourses/>}/>
        <Route path="createCourse" element={<AddCourse />} />
        <Route path='createCategory' element={<CreateCategory/>}/>
        <Route path='manageStudents' element={<ManageStudents/>}/>
        <Route path='manageInstructors' element={<ManageInstructors/>}/>
    </Route>
      
    </Routes>
    
   </div>
  )
}

export default App
