const Category=require("../models/category")

exports.createCategory=async(req,res)=>{
    try {
        const {name,description}=req.body;
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"both email and desc are required"

            })
        }
        //create entry in db
        const categoryDetails=await Category.create({
            name:name,
            description:description,
        })
        console.log(categoryDetails);

        return res.status(200).json({
            success:true,
            message:"category created successfully"
        })
        
        
    } catch (error) {
        console.log(error);

           return res.status(500).json({
            success:false,
            message:"error while creating tag"
        })
        
    }
}

exports.showAllCategory=async(req,res)=>{
    try {
        const allCategory=await Category.find({},{name:true,description:true})  //kisi particular field ke basis pe find nahi krna jo hai sab dedo lekin name aur desc present hona chaiye
        res.status(200).json({
            success:true,
            message:"All category returend successfully",
            data:allCategory,
        })


    } catch (error) {
             return res.status(500).json({
            success:false,
            message:"error while fetching all category"
        })
        
    }
}

exports.categoryPageDetails=async(req,res)=>{
    try {

        const {categoryId}=req.params;

        //get all courses for specified categoryID
        const selectedCategory=await Category.findById(categoryId).populate("courses").exec();

        console.log(selectedCategory);

        //handle the case when category is not present means iss catergoy ka course not present
        if(!selectedCategory){
            console.log("category not found");
            return res.status(404).json({
                success:false,
                message:"category not found",
            })
            
        }

        //handle case when there are no courses
        if(selectedCategory.courses.length===0){
            console.log("no courses found for this category");
            return res.status(404).json({
                success:false,
                message:"no courses found for the selected category"
            })
            
        }

        const selectedCourses=selectedCategory.courses;

        //get courses for other categories

        const differentCategory=await Category.find({
            _id:{$ne:categoryId},

        }).populate("courses").exec();
        
        let differentCourses=[];

        for(const category of differentCategory){
            differentCourses.push(...category.courses);

        }

        //get top selling courses from all categories

        const allCategories=await Category.find().populate("courses");
        const allCourses=allCategories.flatMap((category)=>category.courses);
        const mostSellingCourses=allCourses.sort((a,b)=>b.sold -a.sold).slice(0,10);

        res.status(200).json({
            success:true,
             selectedCategory: selectedCategory,
            selectedCourses:selectedCourses,
            differentCourses:differentCourses,
            mostSellingCourses:mostSellingCourses,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"internal server error",
            error:error.message,
        })
        
    }
}