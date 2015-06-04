using Frllk.Models;
using System;
using System.Runtime.Remoting.Messaging;

namespace Frllk.Services
{
    public class ServiceBase
    {
        private PrivilegeEntities _entities;
        protected PrivilegeEntities DbEntities
        {
            get
            {
                if (_entities == null)
                {
                    _entities = CallContext.LogicalGetData("DbEntities") as PrivilegeEntities;
                    if (_entities == null)
                    {
                        _entities = new PrivilegeEntities();
                        CallContext.LogicalSetData("DbEntities", _entities);
                    }
                }
                return _entities;
            }
        }
        protected T GetDefault<T>() where T : new()
        {
            return new T();
        }
        protected T GetDefault<T>(Action<T> call) where T : new()
        {
            T obj = this.GetDefault<T>();
            call(obj);
            return obj;
        }
    }
}
