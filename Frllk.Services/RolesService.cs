
using Frllk.Interfaces;
using Frllk.Models;
using Frllk.Services;
using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Frllk.Services
{
    public class RolesService : ServiceBase, IRoles
    {
        public GetsResult<RoleDetails> Get(PageParams param)
        {
            var result = GetDefault<GetsResult<RoleDetails>>();
            var query = DbEntities.UserRoles.OrderByDescending(x => x.ID).AsQueryable();
            if (!string.IsNullOrWhiteSpace(param.Name))
                query = query.Where(x => x.RoleName.Contains(param.Name));
            result.Total = query.Count();
            result.Data = query.Skip((param.Current - 1) * param.Size).Take(param.Size).Select(x => new RoleDetails()
            {
                Id = x.ID,
                Name = x.RoleName,
                Funs = x.UserPermissions.Select(f => new IdWithName() { Id = f.UserFunctionality.Id, Name = f.UserFunctionality.Name }).ToList(),
                Users = x.UserToUserRoles.Select(u => new IdWithName() { Id = u.User.Id, Name = u.User.Name }).ToList()
            }).ToList();
            return result;
        }
        public PutResult Put(RoleDetails role)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.UserRoles.FirstOrDefault(x => x.ID == role.Id);
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
            model.RoleName = role.Name;
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
        protected bool isExisted(string name, int exceptId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return true;
            return DbEntities.UserRoles.Count(x => x.RoleName == name && x.ID != exceptId) > 0;
        }
        public PostResult<int> Post(RoleDetails model)
        {
            var result = GetDefault<PostResult<int>>();
            if (isExisted(model.Name, model.Id))
            {
                result.Message = "当前角色名称已经存在";
                return result;
            }
            UserRole role = new UserRole()
            {
                RoleName = model.Name
            };
            DbEntities.UserRoles.Add(role);
            DbEntities.SaveChanges();
            result.Id = role.ID;
            result.isCreated = true;
            return result;
        }
        public DeleteResult Delete(int id)
        {
            var result = GetDefault<DeleteResult>();
            var model = DbEntities.UserRoles.FirstOrDefault(x => x.ID == id);
            if (model != null)
            {
                DbEntities.UserToUserRoles.RemoveRange(model.UserToUserRoles);
                DbEntities.UserRoles.Remove(model);
                DbEntities.SaveChanges();
            }
            result.isDeleted = true;
            return result;
        }
        public PutResult PermissionPut(RoleDetails role)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.UserRoles.FirstOrDefault(x => x.ID == role.Id);
            if (model == null)
            {
                result.Message = string.Format("当前编辑的角色“{0}”已经不存在", role.Name);
                return result;
            }
            var list = model.UserPermissions.ToList();
            DbEntities.UserPermissions.RemoveRange(list.Where(x => !role.Funs.Exists(z => z.Id == x.FunctionalityId)));
            var appends = role.Funs.Where(x => !list.Exists(z => z.FunctionalityId == x.Id));
            DbEntities.UserPermissions.AddRange(appends.Select(x => new UserPermission()
            {
                FunctionalityId = x.Id,
                UserRoleId = role.Id
            }));
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
    }
}
