using Frllk.Interfaces;
using Frllk.Models;
using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.Services
{
    public class FunctionalityService : ServiceBase, IFunctionality
    {
        public GetsResult<FunctionalityDetails> Get(PageParams param)
        {
            var result = GetDefault<GetsResult<FunctionalityDetails>>();
            var query = DbEntities.UserFunctionalities.OrderByDescending(x => x.Id).AsQueryable();
            if (!string.IsNullOrWhiteSpace(param.Name))
                query = query.Where(x => x.Name.Contains(param.Name));
            result.Total = query.Count();
            result.Data = query.Skip((param.Current - 1) * param.Size).Take(param.Size).Select(x => new FunctionalityDetails()
            {
                Id = x.Id,
                Name = x.Name,
                Roles = x.UserPermissions.Select(u => new IdWithName()
                {
                    Id = u.UserRole.ID,
                    Name = u.UserRole.RoleName
                }).ToList(),
                Users = x.UserPermissions.SelectMany(t =>
                    t.UserRole.UserToUserRoles.Select(z =>
                    new IdWithName()
                    {
                        Id = z.UserId,
                        Name = z.User.Name
                    })).ToList()
            }).ToList();
            return result;
        }
        public PutResult Put(FunctionalityDetails role)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.UserFunctionalities.FirstOrDefault(x => x.Id == role.Id);
            if (model == null)
            {
                result.Message = "当前角色已经不存在";
                return result;
            }
            if (isExisted(role.Name, role.Id))
            {
                result.Message = "当前角色名称已经存在";
                return result;
            }
            model.Name = role.Name;
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
        protected bool isExisted(string name, int exceptId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return true;
            return DbEntities.UserFunctionalities.Count(x => x.Name == name && x.Id != exceptId) > 0;
        }
        public PostResult<int> Post(FunctionalityDetails model)
        {
            var result = GetDefault<PostResult<int>>();
            if (isExisted(model.Name, model.Id))
            {
                result.Message = "当前角色名称已经存在";
                return result;
            }
            UserFunctionality func = new UserFunctionality()
            {
                Name = model.Name
            };
            DbEntities.UserFunctionalities.Add(func);
            DbEntities.SaveChanges();
            result.isCreated = true;
            result.Id = func.Id;
            return result;
        }
        public DeleteResult Delete(int id)
        {
            var result = GetDefault<DeleteResult>();
            var model = DbEntities.UserFunctionalities.FirstOrDefault(x => x.Id == id);
            if (model != null)
            {
                DbEntities.UserPermissions.RemoveRange(model.UserPermissions);
                DbEntities.UserFunctionalities.Remove(model);
                DbEntities.SaveChanges();
            }
            result.isDeleted = true;
            return result;
        }
    }
}
