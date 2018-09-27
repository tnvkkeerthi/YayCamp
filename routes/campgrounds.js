var express=require("express");
var router = express.Router();
var Campground=require("../models/campground");
var middleware = require("../middleware");
 
router.get("/", function(req, res){
     Campground.find({}, function(err, allCampgrounds){
         if(err){
             console.log(err);
         } else {
              res.render("campgrounds/index", {campgrounds : allCampgrounds, currentUser: req.user});
         }
     });
   
});  

router.get("/new", middleware.isLoggedIn , function(req, res) {
    res.render("campgrounds/newCamp");
});
 
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
             console.log(err);
         } else {
            // console.log(foundCampground);
              res.render("campgrounds/show", {campground : foundCampground});
         }
    });
    
});

router.post("/", middleware.isLoggedIn , function(req, res){
    var name = req.body.camp_name;
    var url = req.body.img_url;
    var desc = req.body.desc;
    var price = req.body.price;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCamp = {name: name, image:url, price: price, description:desc, author : author};
    Campground.create(newCamp, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else
        {
            console.log(newlyCreated);        
           res.redirect("/campgrounds"); 
        }
        
    });
});

// EDIT CAMPGROUND ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
        
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
      if(err){
          res.redirect("/campgrounds");
      } else {
          //redirect somewhere(show page)
          res.redirect("/campgrounds/" + req.params.id);
      }
    });
});


// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
  });
});


module.exports = router;
