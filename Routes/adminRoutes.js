const express = require('express');
const { createTeachersBatch, createTeacher, markTodayAsHoliday, todaysEvent, getAllEvent, uploadEventImages, resizeEventImage, createStudent, createStudentsBatch, createHomework, resizeHomeworkFiles, uploadHomeworkFiles, markStudentsPresenty, getAllTeachers, getAllBatches, getBatchById, getAllBatchesName, updateteacher, deleteTeacher, getPresentyDataOfTeacherbyMonth, createNotificationForTeacher, createNotificationForBatch, getTeacherById, getDashboardInfo, getPresentyStatusForToday, getAllStudentsBatchesName, getAllStudentListByBatchId, createCourse, getAllcourses, subscribeStudentToCourse, unsubscribeStudentToCourse, getAllStudentsOfCourse, actionOnLeave, listOfLeaves, uploadQrForPayments, uploadQrImage, getAllPendingSubscription, getAllTeachersShortInfo } = require('../Controllers/adminController');
const { isLoggedIn } = require('../Middleware/isLoggedIn');
const { giveAccessTo } = require('../Middleware/giveAccessTo');

const adminRouter = express.Router()


adminRouter.get("/getAllEvents", getAllEvent)
adminRouter.use(isLoggedIn, giveAccessTo("ADMIN"))


adminRouter.post("/createTeachersbatch", createTeachersBatch) //done
adminRouter.post("/createTeachers", createTeacher) // done


adminRouter.get("/getAllBatches", getAllBatches)  //done
adminRouter.get("/getAllBatchNames", getAllBatchesName) //done
adminRouter.get("/getBatch/:batchId", getBatchById) //done


adminRouter.get("/getPresentyData/:teacherId/:month", getPresentyDataOfTeacherbyMonth) //done
adminRouter.get("/getDataOfTeacher/:teacherId", getTeacherById) //done

adminRouter.patch("/updateTeacher", updateteacher) // done
adminRouter.delete("/deleteTeacher/:teacherId", deleteTeacher) // done
adminRouter.get("/getAllTeachers/:branchId", getAllTeachers) //done
adminRouter.get("/getAllTeachersShortInfo/:branchId", getAllTeachersShortInfo) //done

adminRouter.get("/getDashboardInfo", getDashboardInfo)
adminRouter.get("/getTodaysPresentyData/:batchId", getPresentyStatusForToday)

// adminRouter.get("/getAllTodaysTask/:batchId",)


adminRouter.post("/createNotification/teacher/:teacherId", createNotificationForTeacher) //done
adminRouter.post("/createNotification/batch/:batchId", createNotificationForBatch)  //done


adminRouter.post("/markDateAsHoliday", markTodayAsHoliday) // done




adminRouter.post("/todaysEvent", uploadEventImages, resizeEventImage, todaysEvent)  // done



adminRouter.post("/createStudentbatch", createStudentsBatch) // done
adminRouter.get("/getAllStudentsBatchNames", getAllStudentsBatchesName) //done 
adminRouter.get("/getAllStudentsList/:batchId", getAllStudentListByBatchId) //done

adminRouter.post("/markTodaysStudentPresenty", markStudentsPresenty)  // done

adminRouter.post("/createStudent", createStudent)  //done
adminRouter.post("/createHomework", uploadHomeworkFiles, resizeHomeworkFiles, createHomework) // done

// adminRouter.post("/createStudent",)


//leave 
adminRouter.get("/listOfPendingLeaves", listOfLeaves)  // done
adminRouter.post("/actionOnPendingLeaves", actionOnLeave) // done

// payments



// courses
adminRouter.post("/createCourses", createCourse) // done
adminRouter.get("/getAllcourses", getAllcourses) // done
adminRouter.get("/getAllPendingSubscription", getAllPendingSubscription) // done
adminRouter.get("/getAllCourseStudent/:courseId", getAllStudentsOfCourse) // done
adminRouter.post("/subscribeStudentToCourse/:paymentId", subscribeStudentToCourse)  // done
adminRouter.post("/terminateSubscriptionForStudent", unsubscribeStudentToCourse)



// qr 
adminRouter.post("/uploadQrForPayment", uploadQrImage, uploadQrForPayments) //done


module.exports = adminRouter;







