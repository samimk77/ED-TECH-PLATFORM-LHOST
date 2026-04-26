const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/api/v1";

export const categories = {
    // Categories
    CATEGORIES_API : BASE_URL + "/course/categories",
    CREATE_CATEGORY_API: BASE_URL + "/course/categories",
    CATEGORY_PAGE_DETAILS_API: (categoryId) => BASE_URL + `/course/categories/${categoryId}`,

    // Auth
    LOGIN_API:BASE_URL+"/auth/login",
    SIGNUP_API:BASE_URL+"/auth/signup",
    SEND_OTP_API: BASE_URL+"/auth/otp",
    CHANGE_PASSWORD_API:BASE_URL+"/auth/password",

    // Profile
    UPDATE_DISPLAY_PICTURE_API:BASE_URL+"/profile/display-picture",
    UPDATE_PROFILE_API:BASE_URL+"/profile",
    DELETE_PROFILE_API: (userId) => BASE_URL + `/profile` + (userId ? `?userId=${userId}` : ""),
    ENROLLED_COURSES_API:BASE_URL+"/profile/enrolled-courses",
    GET_USER_DETAILS_API:BASE_URL+"/profile",

    // Payments
    CREATE_ORDER_API: BASE_URL + "/payment/orders",
    VERIFY_PAYMENT_API: BASE_URL + "/payment/orders/verify",

    // Course
    CREATE_COURSE_API:BASE_URL+ "/course",
    COURSE_DETAILS_API: (courseId) => BASE_URL + `/course/${courseId}`,
    PUBLISH_COURSE_API: (courseId) => BASE_URL + `/course/${courseId}/publish`,
    
    // Sections
    CREATE_SECTION_API: (courseId) => BASE_URL + `/course/${courseId}/sections`,
    DELETE_SECTION_API: (courseId, sectionId) => BASE_URL + `/course/${courseId}/sections/${sectionId}`,
    UPDATE_SECTION_API: (courseId, sectionId) => BASE_URL + `/course/${courseId}/sections/${sectionId}`,

    // Subsections
    CREATE_SUBSECTION_API: (courseId, sectionId) => BASE_URL + `/course/${courseId}/sections/${sectionId}/subsections`,
    DELETE_SUBSECTION_API: (courseId, sectionId, subSectionId) => BASE_URL + `/course/${courseId}/sections/${sectionId}/subsections/${subSectionId}`,
    UPDATE_SUBSECTION_API: (courseId, sectionId, subSectionId) => BASE_URL + `/course/${courseId}/sections/${sectionId}/subsections/${subSectionId}`,

    // Users
    GET_ALL_STUDENTS_API:BASE_URL+"/auth/students",
    GET_ALL_INSTRUCTORS_API:BASE_URL+"/auth/instructors",

    //CONTACT ROUTE
    CONTACT_API:BASE_URL+"/contact"
}