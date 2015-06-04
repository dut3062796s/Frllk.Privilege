using Frllk.Interfaces;
using Frllk.Models;
using Frllk.Services;
using Frllk.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRLLK.Services
{
    public class UserService : ServiceBase, IUser
    {
        public GetsResult<UserDetails> Get(PageParams param)
        {
            var result = GetDefault<GetsResult<UserDetails>>();
            var query = DbEntities.Users.OrderByDescending(x => x.Id).AsQueryable();
            if (!string.IsNullOrWhiteSpace(param.Name))
            {
                switch (param.Type)
                {
                    case 0:
                        query = query.Where(x => x.Name.Contains(param.Name) || x.Email.Contains(param.Name));
                        break;
                    case 1:
                        query = query.Where(x => x.Name.Contains(param.Name));
                        break;
                    case 2:
                        query = query.Where(x => x.Email.Contains(param.Name));
                        break;
                }

            }
            result.Total = query.Count();
            result.Data = query.Skip((param.Current - 1) * param.Size).Take(param.Size).Select(x => new UserDetails()
            {
                CreateTime = DateTime.Now,
                Email = x.Email,
                Id = x.Id,
                IsVerify = x.isVerify,
                Name = x.Name,
                Password = "*******",
                Roles = x.UserToUserRoles.Select(z => new IdWithName()
                {
                    Id = z.UserRole.ID,
                    Name = z.UserRole.RoleName
                }).ToList()
            }).ToList();
            return result;
        }
        public PutResult Put(UserDetails user)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.Users.FirstOrDefault(x => x.Id == user.Id);
            if (isHas(user.Name, user.Id))
            {
                result.Message = string.Format("当前用户名“{0}”在数据库中已经存在", user.Name);
                return result;
            }
            if (model == null)
            {
                result.Message = string.Format("当前编辑的用户“{0}”已经不存在", user.Name);
                return result;
            }
            model.isVerify = user.IsVerify;
            model.Email = user.Email;
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
        public PostResult<int> Post(UserDetails user)
        {
            var result = GetDefault<PostResult<int>>();
            if (isHas(user.Name, user.Id))
            {
                result.Message = string.Format("当前用户名“{0}”在数据库中已经存在", user.Name);
                return result;
            }
            var model = new User()
            {
                CreateTime = DateTime.Now,
                Password = user.Password,
                Email = user.Email,
                isVerify = user.IsVerify,
                Name = user.Name
            };
            DbEntities.Users.Add(model);
            DbEntities.SaveChanges();
            result.Id = model.Id;
            result.isCreated = true;
            return result;
        }
        protected bool isHas(string name, int exceptId)
        {
            if (string.IsNullOrWhiteSpace(name))
                return false;
            return DbEntities.Users.Count(x => x.Name == name && exceptId != x.Id) > 0;
        }
        public DeleteResult Delete(int id)
        {
            var result = GetDefault<DeleteResult>();
            var model = DbEntities.Users.FirstOrDefault(x => x.Id == id);
            if (model != null)
            {
                DbEntities.UserToUserRoles.RemoveRange(model.UserToUserRoles);
                DbEntities.Users.Remove(model);
                DbEntities.SaveChanges();
            }
            result.isDeleted = true;
            return result;
        }
        public PutResult PwdPut(UserDetails user)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.Users.FirstOrDefault(x => x.Id == user.Id);
            if (model == null)
            {
                result.Message = string.Format("当前编辑的用户“{0}”已经不存在", user.Name);
                return result;
            }
            model.Password = user.Password;
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
        public PutResult RolesPut(UserDetails user)
        {
            var result = GetDefault<PutResult>();
            var model = DbEntities.Users.FirstOrDefault(x => x.Id == user.Id);
            if (model == null)
            {
                result.Message = string.Format("当前编辑的用户“{0}”已经不存在", user.Name);
                return result;
            }

            var list = model.UserToUserRoles.ToList();
            DbEntities.UserToUserRoles.RemoveRange(list.Where(x => !user.Roles.Exists(z => z.Id == x.UserRoleId)));
            var appends = user.Roles.Where(x => !list.Exists(z => z.UserRoleId == x.Id));
            DbEntities.UserToUserRoles.AddRange(appends.Select(x => new UserToUserRole()
            {
                UserId = user.Id,
                UserRoleId = x.Id
            }));
            DbEntities.SaveChanges();
            result.isSaved = true;
            return result;
        }
    }
}
