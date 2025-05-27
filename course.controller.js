import { Course } from "../models/course.model.js";
import getDataUri from '../utils/dataUri.js';
import cloudinary from '../utils/cloudinary.js'
import {Lecture} from '../models/lecture.model.js';


export const createCourse = async(req,res)=> {
    try {
        const {courseTitle,category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course title and category is required",
                success:false
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        })
        return res.status(201).json({
            success:true,
            course,
            message:"Course created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course",
            success:false
        })
    }
}
export const getPublishedCourse = async(_, res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl description"})
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}
export const getCreatorCourses = async (req, res)=>{
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId}).populate('lectures');
        if(!courses){
            return res.status(404).json({
                message:"Course not found",
                courses:[],
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            courses,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}

export const editCourse = async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const {courseTitle,subTitle,description,category,courseLevel,coursePrice} = req.body;
        const file = req.file;

        let course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                message:"Course not found",
            })
        }
        let courseThumbnail;
        if(file){
            const fileUri = getDataUri(file)
            courseThumbnail = await cloudinary.uploader.upload(fileUri)
        }
        const updateData = {courseTitle,subTitle,description,category,courseLevel,coursePrice,courseThumbnail:courseThumbnail?.secure_url};
        course = await Course.findByIdAndUpdate(courseId,updateData,{new:true})
        return res.status(200).json({
            success:true,
            course,
            message:"Course updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update course",
            success:false
        })
    }
}

export const getCourseById = async(req,res)=> {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                message:"Course not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get course",
            success:false
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Xóa các lecture liên quan trước
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({
          message: "Course not found",
          success: false,
        });
      }
  
      await Lecture.deleteMany({ _id: { $in: course.lectures } });
  
      // Sau đó xóa khóa học
      await Course.findByIdAndDelete(courseId);
  
      return res.status(200).json({
        success: true,
        message: "Course and its lectures deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Failed to delete course",
        success: false,
      });
    }
  };

//lecture controllers

export const createLecture = async(req, res)=>{
    try {
        const {lectureTitle} = req.body;
        const {courseId} = req.params;

        if(!lectureTitle || !courseId){
            return res.status(400).json({
                message:"Lecture title is required"
            })
        }
        const lecture = await Lecture.create({lectureTitle});
        const course = await Course.findById(courseId);
        if(course){
            course.lectures.push(lecture._id);
            await course.save()
        }
        return res.status(201).json({
            success:true,
            lecture,
            message:"Lecture created successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create Lecture"
        })
        
    }
}

export const getCourseLecture = async (req, res) => {
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate('lectures');
        if(!course){
            return res.status(404).json({
                message:"course not found"
            })
        }
        return res.status(200).json({
            success:true,
            lectures:course.lectures
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get Lectures"
        })
    }
}

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        console.log("📦 Incoming videoInfo:", videoInfo); // DEBUG

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!",
            });
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();

        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            success: true,
            lecture,
            message: "Lecture updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lectures",
            success: false,
        });
    }
};



export const removeLecture = async(req,res)=>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        await Course.updateOne(
            {lectures: lectureId}, 
            {$pull: {lectures:lectureId}} 
        );
        return res.status(200).json({
            success:true,
            message:"Lecture removed successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}


export const togglePublishedCourse = async (req, res)=>{
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true , false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }
        course.isPublished = !course.isPublished
        await course.save()

        const statusMessage = course.isPublished ? "Published":"Unpublished";
        return res.status(200).json({
          success:true,
          message:`Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}
// tìm kiếm
export const searchCourse = async (req, res) => {
  try {
    const { query } = req.query;

    const keyword = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: 'i' } },
        { subTitle: { $regex: query, $options: 'i' } },
      ]
    };

    const course = await Course.find(keyword).populate({
      path: 'creator',
      select: 'name photoUrl description',
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
