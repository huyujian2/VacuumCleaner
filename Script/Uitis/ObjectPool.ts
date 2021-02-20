import { _decorator, Component, Node, loader, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ObjectPool')
export class ObjectPool extends Component {

    //单例模式
    private static objectPool: ObjectPool
    public static Instance(): ObjectPool 
    {
      if (this.objectPool == null) 
      {
        this.objectPool = new ObjectPool()
      }
      return ObjectPool.objectPool
    }

    private ObjectDic:Map<string,Array<any>> = new Map<string,Array<any>>()

    /**从池子里获取Obj */
    public getObj(name:string):any
    {
        if(!this.ObjectDic.has(name))
        {
            let prefab = loader.getRes(name)
            const newNode = instantiate(prefab)
            console.info(newNode)
            let array = new Array()
            array.push(newNode)
            this.ObjectDic.set(name,array)
            console.info(this.ObjectDic)
            return this.ObjectDic.get(name).pop()
        }
        else
        {
          
          if(this.ObjectDic.get(name).length>0)
          {
            return this.ObjectDic.get(name).pop()
          }
          else
          {
              let prefab = loader.getRes(name)
              const newNode = instantiate(prefab)
              return newNode
          }
        }
    }

    /**把节点放进池子 */
    public putInObj(name,node:Node)
    {
      node.active = false
      this.ObjectDic.get(name).push(node)
    }

    public releasePool()
    {
      this.ObjectDic = new Map<string,Array<any>>()
    }
   
}
