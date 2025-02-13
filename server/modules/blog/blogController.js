const httpStatus = require('http-status');
var objectId = require('mongoose').Types.ObjectId;
const otherHelper = require('../../helper/others.helper');
const blogConfig = require('./blogConfig');
const blogSch = require('./blogSchema');
const blogCatSch = require('./categorySchema');
const blogcontroller = {};

blogcontroller.GetBlogAuthorize = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let sortq;
    let searchq;
    let populate;
    let selectq;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    if (req.query.sort) {
      let sortfield = req.query.sort.slice(1);
      let sortby = req.query.sort.charAt(0);
      if (sortby == 1 && !isNaN(sortby) && sortfield) {
        //one is ascending
        sortq = sortfield;
      } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
        //zero is descending
        sortq = '-' + sortfield;
      } else {
        sortq = '';
      }
    }
    populate = [
      {
        path: 'author',
        select: '_id name',
      },
      {
        path: 'category',
        select: '_id title',
      },
    ];
    selectq = 'title description summary tags author short_description meta_tag meta-description category keywords slug_url is_published published_on is_active image added_by added_at updated_at updated_by';
    searchq = {
      is_deleted: false,
    };
    if (req.query.find_title) {
      searchq = {
        title: {
          $regex: req.query.find_title,
          $options: 'i',
        },
        ...searchq,
      };
    }
    if (req.query.find_published_on) {
      searchq = {
        published_on: {
          $regex: req.query.find_published_on,
          $options: 'i',
        },
        ...searchq,
      };
    }
    let blogs = await otherHelper.getquerySendResponse(blogSch, page, size, sortq, searchq, selectq, next, populate);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, blogs.data, blogConfig.get, page, size, blogs.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.getLatestBlog = async (req, res, next) => {
  try {
    const data = await blogSch
      .find({ is_active: true, is_deleted: false })
      .select({ slug_url: 1, title: 1, added_at: 1, image: 1 })
      .sort({ _id: -1 })
      .skip(0)
      .limit();
    return otherHelper.sendResponse(res, httpStatus.OK, true, data, null, 'Latest Blog get success!!', null);
  } catch (err) {
    next(err);
  }
};
blogcontroller.getLatestBlogByCat = async (req, res, next) => {
  try {
    const size_default = 10;
    let size;
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    const cat_id = req.params.cat_id;
    const category = await blogCatSch.findById(cat_id).select({ title: 1 });
    const blogs = await blogSch
      .find({ is_active: true, is_deleted: false, category: cat_id })
      .select({ short_description: 1, slug_url: 1, title: 1, added_at: 1, image: 1, category: 1, author: 1 })
      .populate([{ path: 'category', select: 'title' }, { path: 'author', select: 'name' }])
      .sort({ _id: -1 })
      .skip(0)
      .limit(size * 1);
    const totaldata = blogs.length;
    return otherHelper.sendResponse(res, httpStatus.OK, true, { blogs, category, totaldata }, null, 'Latest blogs by category', null);
  } catch (err) {
    next(err);
  }
};
blogcontroller.getRealtedBlog = async (req, res, next) => {
  try {
    const tages = await blogSch.findOne({ is_active: true, is_deleted: false, slug_url: req.params.slug_url }).select('tags meta_tag category keywords');
    // .lean();
    const d = [...tages.meta_tag, ...tages.keywords, ...tages.tags];

    const data = await blogSch
      .find({ is_active: true, is_deleted: false, slug_url: { $ne: req.params.slug_url }, tags: { $elemMatch: { $in: d } } })
      .select({ slug_url: 1, title: 1, added_at: 1, image: 1 })
      .sort({ _id: -1 })
      .skip(0)
      .limit(5);
    return otherHelper.sendResponse(res, httpStatus.OK, true, data, null, 'Latest Blog', null);
  } catch (err) {
    next(err);
  }
};

blogcontroller.GetBlogArchives = async (req, res, next) => {
  try {
    const blogArchives = await blogSch
      .find({ is_deleted: false, is_active: true })
      .select({ added_at: 1, published_on: 1 })
      .sort({ added_at: -1 })
      .skip(0)
      .limit(10);
    const month = [];
    const months = blogArchives.map(each => {
      if (month.includes(each.added_at.getMonth())) {
        return null;
      } else {
        month.push(each.added_at.getMonth());
        return each.added_at;
      }
    });
    return otherHelper.sendResponse(res, httpStatus.OK, true, months, null, 'archives get success!!', null);
  } catch (err) {
    next(err);
  }
};

blogcontroller.GetBlogUnauthorize = async (req, res, next) => {
  try {
    const size_default = 12;
    let page;
    let size;
    let sortq;
    let populate;
    let searchq;
    let selectq;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    if (req.query.sort) {
      let sortfield = req.query.sort.slice(1);
      let sortby = req.query.sort.charAt(0);
      if (sortby == 1 && !isNaN(sortby) && sortfield) {
        //one is ascending
        sortq = sortfield;
      } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
        //zero is descending
        sortq = '-' + sortfield;
      } else {
        sortq = '';
      }
    }
    populate = [
      {
        path: 'category',
        select: '_id title',
      },

      {
        path: 'author',
        select: '_id name',
      },
    ];
    selectq = 'title description summary tags author short_description meta_tag meta-description category keywords slug_url published_on is_active image added_by added_at updated_at updated_by';
    searchq = {
      is_deleted: false,
    };
    searchq = {
      is_published: true,
      ...searchq,
    };
    if (req.query.find_title) {
      searchq = {
        title: {
          $regex: req.query.find_title,
          $options: 'i',
        },
        ...searchq,
      };
    }
    if (req.query.find_published_on) {
      searchq = {
        published_on: {
          $regex: req.query.find_published_on,
          $options: 'i',
        },
        ...searchq,
      };
    }
    let blogs = await otherHelper.getquerySendResponse(blogSch, page, size, sortq, searchq, selectq, next, populate);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, blogs.data, blogConfig.get, page, size, blogs.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogCategory = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let sortq;
    let searchq;
    let selectq;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    if (req.query.sort) {
      let sortfield = req.query.sort.slice(1);
      let sortby = req.query.sort.charAt(0);
      if (sortby == 1 && !isNaN(sortby) && sortfield) {
        //one is ascending
        sortq = sortfield;
      } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
        //zero is descending
        sortq = '-' + sortfield;
      } else {
        sortq = '';
      }
    }
    selectq = 'title slug_url description image is_active added_by added_at is_deleted';
    searchq = { is_deleted: false };
    if (req.query.find_title) {
      searchq = {
        title: {
          $regex: req.query.find_title,
          $options: 'i',
        },
        ...searchq,
      };
    }
    let blogcats = await otherHelper.getquerySendResponse(blogCatSch, page, size, sortq, searchq, selectq, next, '');
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, blogcats.data, blogConfig.cget, page, size, blogcats.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogCatBySlug = async (req, res, next) => {
  try {
    const slug_url = req.params.slug;
    const blogcats = await blogCatSch.findOne({
      slug_url,
    });
    return otherHelper.sendResponse(res, httpStatus.OK, true, blogcats, null, blogConfig.cget, null);
  } catch (err) {
    next(err);
  }
};
blogcontroller.SaveBlog = async (req, res, next) => {
  try {
    let blogs = req.body;
    if (req.file) {
      req.file.destination =
        req.file.destination
          .split('\\')
          .join('/')
          .split('server/')[1] + '/';
      req.file.path = req.file.path
        .split('\\')
        .join('/')
        .split('server/')[1];
    }
    if (blogs && blogs._id) {
      if (req.file) {
        blogs.image = req.file;
      }
      if (!blogs.meta_tag) blogs.meta_tag = [];
      if (!blogs.category) blogs.category = [];
      if (!blogs.tags) blogs.tags = [];
      if (!blogs.keywords) blogs.keywords = [];
      const update = await blogSch.findByIdAndUpdate(
        blogs._id,
        {
          $set: blogs,
        },
        { new: true },
      );
      return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, blogConfig.save, null);
    } else {
      blogs.image = req.file;
      const newBlog = new blogSch(blogs);
      const BlogSave = await newBlog.save();
      return otherHelper.sendResponse(res, httpStatus.OK, true, BlogSave, null, blogConfig.save, null);
    }
  } catch (err) {
    next(err);
  }
};
blogcontroller.SaveBlogCategory = async (req, res, next) => {
  try {
    let blogcats = req.body;
    if (req.file) {
      req.file.destination =
        req.file.destination
          .split('\\')
          .join('/')
          .split('server/')[1] + '/';
      req.file.path = req.file.path
        .split('\\')
        .join('/')
        .split('server/')[1];
    }
    if (blogcats && blogcats._id) {
      if (req.file) {
        blogcats.image = req.file;
      }
      const update = await blogCatSch.findByIdAndUpdate(
        blogcats._id,
        {
          $set: blogcats,
        },
        { new: true },
      );
      return otherHelper.sendResponse(res, httpStatus.OK, true, update, null, blogConfig.csave, null);
    } else {
      blogcats.image = req.file;
      const newBlog = new blogCatSch(blogcats);
      const catSave = await newBlog.save();
      return otherHelper.sendResponse(res, httpStatus.OK, true, catSave, null, blogConfig.csave, null);
    }
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogDetail = async (req, res, next) => {
  const id = req.params.id;
  const populate = [];
  const blog = await blogSch
    .findOne({
      _id: id,
      is_deleted: false,
    })
    .populate(populate);
  return otherHelper.sendResponse(res, httpStatus.OK, true, blog, null, blogConfig.get, null);
};
blogcontroller.GetBlogBySlug = async (req, res, next) => {
  const slug = req.params.slug_url;
  const blogs = await blogSch
    .findOne(
      {
        slug_url: slug,
        is_deleted: false,
        is_published: true,
      },
      {
        is_published: 0,
      },
    )
    .populate([{ path: 'author', select: '_id name avatar image' }, { path: 'category', select: '_id title slug_url' }]);
  return otherHelper.sendResponse(res, httpStatus.OK, true, blogs, null, blogConfig.get, null);
};

blogcontroller.GetBlogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const blogs = await blogSch
      .findOne({
        _id: id,
        is_deleted: false,
      })
      .populate([{ path: 'author', select: '_id name avatar image' }, { path: 'category', select: '_id title slug_url' }]);
    return otherHelper.sendResponse(res, httpStatus.OK, true, blogs, null, blogConfig.get, null);
  } catch (err) {
    next(err);
  }
};

blogcontroller.GetBlogByCat = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let sortq;
    let populate;
    let searchq;
    let selectq;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    if (req.query.sort) {
      let sortfield = req.query.sort.slice(1);
      let sortby = req.query.sort.charAt(0);
      if (sortby == 1 && !isNaN(sortby) && sortfield) {
        //one is ascending
        sortq = sortfield;
      } else if (sortby == 0 && !isNaN(sortby) && sortfield) {
        //zero is descending
        sortq = '-' + sortfield;
      } else {
        sortq = '';
      }
    }
    const slug = req.params.slug_url;
    const cat = await blogCatSch.findOne({ slug_url: slug, is_deleted: false }, { _id: 1, title: 1 });
    populate = [
      {
        path: 'category',
        select: 'title slug_url',
      },
      {
        path: 'author',
        select: 'name',
      },
    ];
    selectq = 'title description summary tags author short_description meta_tag meta-description category keywords slug_url published_on is_active image added_by added_at updated_at updated_by';
    searchq = {
      is_deleted: false,
    };
    searchq = {
      is_published: true,
      is_deleted: false,
      category: cat._id,
      ...searchq,
    };
    if (req.query.find_title) {
      searchq = {
        title: {
          $regex: req.query.find_title,
          $options: 'i',
        },
        ...searchq,
      };
    }
    if (req.query.find_published_on) {
      searchq = {
        published_on: {
          $regex: req.query.find_published_on,
          $options: 'i',
        },
        ...searchq,
      };
    }
    let blogs = await otherHelper.getquerySendResponse(blogSch, page, size, sortq, searchq, selectq, next, populate);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, blogs.data, cat.title, page, size, blogs.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogByTag = async (req, res, next) => {
  try {
    let page;
    let size;
    let searchq;
    let populateq;
    const size_default = 10;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    const tag = req.params.tag;
    populateq = [{ path: 'author', select: 'name' }];
    searchq = {
      is_deleted: false,
      tags: tag,
    };
    const tagBlog = await otherHelper.getquerySendResponse(blogSch, page, size, '', searchq, '', next, populateq);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, tagBlog.data, blogConfig.get, page, size, tagBlog.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogByAuthor = async (req, res, next) => {
  try {
    const size_default = 10;
    let page;
    let size;
    let searchq;
    let populateq;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    const authorId = req.params.author;
    populateq = [{ path: 'author', select: 'name' }];
    searchq = { is_deleted: false, is_active: true, author: authorId };
    const blogByAuthor = await otherHelper.getquerySendResponse(blogSch, page, size, '', searchq, '', next, populateq);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, blogByAuthor.data, 'blogs by author get success!!', page, size, blogByAuthor.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.GetBlogByDate = async (req, res, next) => {
  try {
    let page;
    let size;
    let searchq;
    let populateq;
    const size_default = 10;
    if (req.query.page && !isNaN(req.query.page) && req.query.page != 0) {
      page = Math.abs(req.query.page);
    } else {
      page = 1;
    }
    if (req.query.size && !isNaN(req.query.size) && req.query.size != 0) {
      size = Math.abs(req.query.size);
    } else {
      size = size_default;
    }
    let start = new Date(req.params.time);
    let end = new Date(req.params.time);
    end.setMonth(end.getMonth() + 1);

    searchq = {
      is_deleted: false,
    };
    if (start) {
      searchq = {
        added_at: {
          $gte: start,
          $lt: end,
        },
        ...searchq,
      };
    }
    populateq = [{ path: 'category', select: 'title' }, { path: 'author', select: 'name' }];

    const tagBlog = await otherHelper.getquerySendResponse(blogSch, page, size, '', searchq, '', next, populateq);
    return otherHelper.paginationSendResponse(res, httpStatus.OK, true, tagBlog.data, blogConfig.get, page, size, tagBlog.totaldata);
  } catch (err) {
    next(err);
  }
};
blogcontroller.DeleteBlog = async (req, res, next) => {
  const id = req.params.id;
  const blog = await blogSch.findByIdAndUpdate(objectId(id), {
    $set: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
  return otherHelper.sendResponse(res, httpStatus.OK, true, blog, null, blogConfig.delete, null);
};
blogcontroller.DeleteBlogCat = async (req, res, next) => {
  const id = req.params.id;
  const blogCat = await blogCatSch.findByIdAndUpdate(objectId(id), {
    $set: {
      is_deleted: true,
      deleted_at: new Date(),
    },
  });
  return otherHelper.sendResponse(res, httpStatus.OK, true, blogCat, null, blogConfig.deleteCat, null);
};

module.exports = blogcontroller;
