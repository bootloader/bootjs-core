const mappings = {
  controller : [],
  jobs : [],
  addController(){
    this.controller.push({
      maps : []
    })
  },
  updateController(meta){
    let controller = this.controller[this.controller.length-1]
    this.controller[this.controller.length-1] = {
      ...controller,
      ...meta
    }
  },
  addHandler(originalMethod){
    if(originalMethod.__index){
        return
    }
    originalMethod.__index =  true;
    let controller = this.controller[this.controller.length-1]
    controller.maps.push({})
  },
  updateHandler(meta){
    let controller = this.controller[this.controller.length-1]
    let map = controller.maps[controller.maps.length-1]
    controller.maps[controller.maps.length-1] = {
      ...map,
      ...meta
    }
  },
  addJob(){
    this.jobs.push({
      maps : []
    })
  },
  updateJob(meta){
    let job = this.jobs[this.jobs.length-1]
    this.jobs[this.jobs.length-1] = {
      ...job,
      ...meta
    }
  },
}

function Controller(basePathOption) {
  let options = (typeof basePathOption == "string" ?  {
    path : basePathOption
  } : basePathOption) || {};
  mappings.addController()
  return function (originalMethod,context) {
    //console.log(`@Controller:IN ${basePath}`,context)
    mappings.updateController({...options, controller : originalMethod})
  };
}


function RequestMapping(requestOptions) {
  return function (originalMethod, context) {
    //console.log(`@RequestMapping:IN ${method}:${path}`,context)
    if (context.kind !== "method" || !context.access) {
      throw new Error("@RequestMapping can only be used on methods!");
    }
    mappings.addHandler(originalMethod)
    mappings.updateHandler({...requestOptions, handler : originalMethod, name : context.name})
  };
}

function ResponseBody() {
  let responseType = "json";
  return function (originalMethod, context) {
    console.log("context",context)
    if (context.kind !== "method" || !context.access) {
      throw new Error("@ResponseBody can only be used on methods!");
    }
    mappings.addHandler(originalMethod)
    mappings.updateHandler({responseType, handler : originalMethod})
  };
}

function ResponseView({  }) {
  let responseType = "view";
  return function (originalMethod, context) {
    if (context.kind !== "method" || !context.access) {
      throw new Error("@ResponseView can only be used on methods!");
    }
    mappings.addHandler(originalMethod)
    mappings.updateHandler({responseType, handler : originalMethod})
  };
}


function AuthRequired(auth) {
  //console.log("AuthRequired",auth)
  return function (originalMethod, context) {
    //console.log("AuthRequired:inside",context)
    mappings.addHandler(originalMethod)
    mappings.updateHandler({auth : auth || {} })
  }
}

function Job(baseJobOptions) {
  let options = (typeof baseJobOptions == "string" ?  {
    name : baseJobOptions
  } : baseJobOptions) || {};
  mappings.addJob()
  return function (originalMethod,context) {
    //console.log(`@Controller:IN ${basePath}`,context)
    mappings.updateJob({...options, job : originalMethod})
  };
}

module.exports = {
  Controller,
  RequestMapping,
  ResponseBody,
  ResponseView,
  AuthRequired,
  Job,
  mappings
};
